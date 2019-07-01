const getters = {
  device: state => state.app.device,
  addRouters: state => state.permission.addRouters,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  roles: state => state.user.roles,
  token: state => state.user.token
}

export default getters
