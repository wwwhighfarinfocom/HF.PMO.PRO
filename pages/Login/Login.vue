<template>
	<view id="maim" :style="{height:maxHeight+'px'}">
		<view class="login">
			<view class="titletyle">
				<text>高远科技-项目管理</text>
			</view>
			<view class="tenanttyle">
				<text>租户：{{tenantName}}</text><text class="zhbiangen" @click="biangen">(变更)</text>
			</view>
			<view class="input-item">
				<view class="title-content">
					<text class="title">账号</text>
				</view>
				<input class="input" placeholder="用户名/邮箱" style="margin-left: 40rpx;" v-model="username" />
			</view>
			<view class="input-item">
				<view class="title-content">
					<text class="title">密码</text>
				</view>
				<input class="input" password="true" placeholder="请输入密码" style="margin-left: 40rpx;"
					v-model="password" />
			</view>
			<view class="input-itemjizhu">
				<view>
					<checkbox-group>
						<label>
							<checkbox value="cb" color="#FFFFFF" :checked="rememberPsw"
								@tap="rememberPsw =! rememberPsw" />记住账号密码
						</label>
					</checkbox-group>
				</view>
			</view>
			<view class="button" @click="login">登录</view>
			<view class="banquan">
				<text class="banquandec">© 2022 高远科技-项目管理系统 V-1.0.0.0</text>
				<text class="banquandec">2022-02-17</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				maxHeight: 1500,
				tenantName: 'MG',
				rememberPsw: false,
			}
		},
		onLoad() {
			var me = this;
			/* 页面渲染 */
			uni.getSystemInfo({
				success: (res) => {
					me.maxHeight = res.windowHeight;
				}
			})
		},
		mounted() {
			var me = this;
			/* 页面加载完成，获取本地存储的用户名及密码 */
			const username = uni.getStorageSync('username');
			const password = uni.getStorageSync('password');
			if (username && password) {
				me.username = username;
				me.password = password;
			} else {
				me.username = "";
				me.password = "";
			}
			/* 登录前 */
			me.beforeLoginUpdCookie();
		},
		methods: {
			/* 登录前 更新Cookie*/
			beforeLoginUpdCookie() {
				var me = this;
				var params = {
					returnUrl: "/"
				}
				uni.request({
					url: me.requestUrl + "/Account/Login",
					method: "GET",
					data: params,
					withCredentials: true, // 请求允许携带Cookies凭证
					success(res) {
						var dat = res;
						me.beforeLoginUpdTenant();
					}
				})
			},

			/* 租户更新 */
			beforeLoginUpdTenant() {
				var me = this;
				if (me.tenantName == '' || me.tenantName == null) {
					me.removeCookie('Abp.TenantId');
				} else {
					uni.request({
						url: me.requestUrl + "/api/services/app/Account/IsTenantAvailable",
						method: "POST",
						withCredentials: true,
						data: {
							tenancyName: me.tenantName
						},
						header: {
							'content-type': 'application/json' //设置请求标头
						},
						success(res) {
							if (res.statusCode == 200) {
								if (res.data.result.state == 1) {
									me.setCookieValue('Abp.TenantId', res.data.result.tenantId)
								} else {
									me.removeCookie('Abp.TenantId');
								}
							}
						}
					})
				}
			},
			// 登录
			login() {
				var me = this;
				uni.showLoading();
				var params = {
					password: me.password,
					usernameOrEmailAddress: me.username,
					rememberMe: false,
					returnUrl: "/",
					returnUrlHash: ""
				}

				// 登录请求
				uni.request({
					url: me.requestUrl + "/Account/Login",
					method: "POST",
					data: params,
					withCredentials: true,
					header: {
						'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
					},
					success(res) {
						// 主页
						if (res.data.success) {
							uni.navigateTo({
								url: "../Home/Home",
								success() {
									//登录成功将用户名密码存储到用户本地
									if (me.rememberPsw) {
										//用户勾选记住账号密码
										uni.setStorageSync('username', me.username);
										uni.setStorageSync('password', me.password);
									} else { //用户没有勾选“记住密码”
										uni.removeStorageSync('username');
										uni.removeStorageSync('password');
										me.username = "";
										me.password = "";
									}
								}
							})
						} else {
							uni.showToast({
								title: "登录失败",
								icon: "error"
							})
						}
					},
					complete() {
						uni.hideLoading();
					}
				})
			},

			// 租户变更
			biangen() {
				var me = this;
				uni.showModal({
					title: '更改租户',
					editable: true,
					placeholderText: "租户标识",
					success: function(res) {
						if (res.confirm) {
							me.tenantName = res.content;
						}
					}
				});
			},

			/* 设置Cookie */
			setCookieValue(cname, value) {
				// 到期日期
				var expireDate = new Date(new Date().getTime() + 5 * 365 * 86400000);
				var expire = "expires=" + expireDate.toUTCString();
				document.cookie = cname + "=" + value + ";" + expire;
			},

			/* 移除指定Cookie */
			removeCookie(cname) {
				var name = cname + "=";
				var ca = document.cookie.split(';');
				var cookieStr = "";
				for (var i = 0; i < ca.length; i++) {
					var c = ca[i].trim();
					if (c.indexOf(name) == 0) {
						document.cookie = c + ';expires=' + new Date(0).toUTCString()
					} else {
						cookieStr += c;
						cookieStr += ";";
					}
					document.cookie = cookieStr;
				}
			}
		},
		watch: {
			tenantName(newVal, oldVal) {
				console.log(newVal, oldVal);
				this.beforeLoginUpdTenant();
			}
		}
	}
</script>

<style>
	@import url("/common/css/Login.css");
</style>
