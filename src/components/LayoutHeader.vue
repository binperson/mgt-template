<template>
    <a-layout-header style="padding: 0px">
        <div class="header">
            <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click.native="toggle"/>
            <div class="user-wrapper">
                <span class="action">
                    <a-icon type="question-circle-o"></a-icon>
                </span>
                <span class="action">
                    <a-badge count="12">
                        <a-icon class="icon" type="bell"></a-icon>
                    </a-badge>
                </span>
                <a-dropdown>
                    <span class="action ant-dropdown-link user-dropdown-menu">
                      <a-avatar class="avatar" size="small" src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"/>
                      <span>{{ nickname() }}</span>
                    </span>
                    <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
                        <a-menu-item key="0">
                            <a-icon type="user"/>
                            <span>个人中心</span>
                        </a-menu-item>
                        <a-menu-item key="1">
                            <a-icon type="setting"/>
                            <span>账户设置</span>
                        </a-menu-item>
                        <a-menu-item key="2" disabled>
                            <a-icon type="setting"/>
                            <span>测试</span>
                        </a-menu-item>
                        <a-menu-divider/>
                        <a-menu-item key="3">
                            <a-icon type="logout"/>
                            <span @click="handleLogout">退出登录</span>
                        </a-menu-item>
                    </a-menu>
                </a-dropdown>
            </div>
        </div>
    </a-layout-header>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LayoutHeader',
  props: {
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {}
  },
  created () {},
  methods: {
    ...mapActions(['Logout']),
    ...mapGetters(['nickname']),
    handleLogout () {
      this.Logout({})
        .then(() => {
          window.location.reload()
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    toggle () {
      this.$emit('toggle')
    }
  }
}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
</style>
