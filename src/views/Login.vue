<template>
  <div id="auth">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <img src="~@/assets/logo.svg" class="logo" alt="logo">
            <span class="title">Ant Design</span>
          </a>
        </div>
        <div class="desc">
          Ant Design 是西湖区最具影响力的 Web 设计规范
        </div>
      </div>
      <div class="main">
        <a-form :form="form" ref="formLogin" id="formLogin">
          <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }" @change="handleTabClick">
            <a-tab-pane key="tab1" tab="账号密码登陆">

              <a-form-item>
                <a-input
                  v-decorator="['formLogin.username', {rules: [{ required: true, message: '请输入帐户名或邮箱地址' }, { validator: this.handleUsernameOrEmail }], validateTrigger: 'blur'}]"
                  size="large" type="text" placeholder="帐户名或邮箱地址">
                  <a-icon slot="prefix" type='user' :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>

              <a-form-item>
                <a-input
                  v-decorator="['formLogin.password', {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}]"
                  size="large" type="password" placeholder="密码">
                  <a-icon slot="prefix" type='lock' :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-tab-pane>
            <a-tab-pane key="tab2" tab="手机号登陆">
              <a-form-item>
                <a-input
                  v-decorator="['formLogin.mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'blur'}]"
                  size="large" type="text" placeholder="手机号">
                  <a-icon slot="prefix" type='mobile' :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>

              <a-row :gutter="16">
                <a-col class="gutter-row" :span="16">
                  <a-form-item>
                    <a-input
                      v-decorator="['formLogin.captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]"
                      size="large" type="text" placeholder="验证码">
                      <a-icon slot="prefix" type='mail' :style="{ color: 'rgba(0,0,0,.25)' }" />
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col class="gutter-row" :span="8">
                    <span class="ivu-input-prefix">
                      <a-button class="getCaptcha" :disabled="state.smsSendBtn"
                                @click.stop.prevent="getCaptcha" v-text="!state.smsSendBtn&&'获取验证码'||(state.time+' s')"></a-button>
                    </span>
                </a-col>
              </a-row>

            </a-tab-pane>
          </a-tabs>

          <a-form-item>
            <a-checkbox v-model="rememberMe">自动登陆</a-checkbox>
            <router-link :to="{ name: 'recover', params: { user: 'aaa'} }" class="forge-password" style="float: right;">忘记密码</router-link>
          </a-form-item>

          <a-form-item style="margin-top:24px">
            <a-button size="large" type="primary"
                      htmlType="submit" class="login-button" :loading="loginBtn"
                      @click.stop.prevent="handleSubmit" v-bind:disabled="loginBtn" >确定</a-button>
          </a-form-item>

        </a-form>
      </div>
      <div class="footer">
        <div class="links">
          <a href="_self">帮助</a>
          <a href="_self">隐私</a>
          <a href="_self">条款</a>
        </div>
        <div class="copyright">
          Copyright &copy; 2018 白鹭学园技术组出品
        </div>
      </div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import md5 from 'md5'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('user')

export default {
  data () {
    return {
      customActiveKey: 'tab1',
      state: {
        time: 60,
        smsSendBtn: false
      },
      loginBtn: false,
      form: this.$form.createForm(this),
      rememberMe: true
    }
  },
  methods: {
    ...mapActions(['Login']),
    handleTabClick (key) {
      this.customActiveKey = key
      this.form.resetFields()
    },
    handleUsernameOrEmail (rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    handleSubmit () {
      let formLogin
      let flag = false

      if (this.customActiveKey === 'tab1') {
        this.form.validateFields(['formLogin.username', 'formLogin.password'], { force: true }, (err, value) => {
          if (!err) {
            flag = true
            formLogin = value.formLogin
          }
        })
      } else {
        this.form.validateFields(['formLogin.mobile', 'formLogin.captcha'], { force: true }, (err, value) => {
          if (!err) {
            flag = true
            console.log(value)
            formLogin = value.formLogin
            this.loginType = 2 // 登录类型修改为手机登录
          }
        })
      }
      if (!flag) return

      this.loginBtn = true

      let loginParams = {
        password: md5(formLogin.password),
        remember_me: this.rememberMe
      }

      switch (this.loginType) {
        case 0:
          loginParams.email = formLogin.username
          break
        case 1:
          loginParams.username = formLogin.username
          break
        case 2:
        default:
          loginParams.mobile = formLogin.mobile
          loginParams.captcha = formLogin.captcha
          break
      }

      this.Login(loginParams).then(() => {
        this.loginBtn = false
        this.$router.push({ name: 'dashboard' })
      }).catch((err) => {
        this.requestFailed(err)
      })
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: (err || {}).message || ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.loginBtn = false
    }
  }
}
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
  #auth {
    height: 100%;

    .container {
      width: 100%;
      min-height: 100%;
      background: #f0f2f5 url(/static/background.svg) no-repeat 50%;
      background-size: 100%;
      padding: 110px 0 144px;
      position: relative;

      a {
        text-decoration: none;
      }

      .top {
        text-align: center;

        .header {
          height: 44px;
          line-height: 44px;

          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 44px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 33px;
            color: rgba(0,0,0,.85);
            font-family: "Myriad Pro","Helvetica Neue",Arial,Helvetica,sans-serif;
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 40px;
        }
      }

      .main {
        width: 368px;
        margin: 0 auto;

        label {
          font-size: 14px;
        }

        .ivu-input-prefix {
          left: 12px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.25);
        }
        .getCaptcha {
          display: block;
          width: 100%;
          height: 40px;
        }

        .forge-password {
          font-size: 14px;
        }
        button.login-button {
          padding: 0 15px;
          font-size: 16px;
          height: 40px;
          width: 100%;
        }
      }

      .footer {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 0 16px;
        margin: 48px 0 24px;
        text-align: center;

        .links {
          margin-bottom: 8px;
          font-size: 14px;
          a {
            color: rgba(0, 0, 0, 0.45);
            transition: all 0.3s;
            &:not(:last-child) {
              margin-right: 40px;
            }
          }
        }
        .copyright {
          color: rgba(0, 0, 0, 0.45);
          font-size: 14px;
        }
      }
    }
  }
</style>
