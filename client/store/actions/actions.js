// import model from '../../model/client-model'
import model from 'model'
import notify from '../../components/notification/function'
import bus from '../../util/bus'

const handleError = (err) => {
  // handle error
  if (err.code === 401) {
    notify({
      content: '你得先登录啊！'
    })
    bus.$emit('auth')
  }
}

export default {
  updateCountAsync (store, data) {
    // console.log('asdasd')
    setTimeout(() => {
      store.commit('updateCount', {
        num: data.num
      })
    }, data.time)
  },
  fetchTodos ({ commit }) {
    commit('startLoading')
    return model.getAllTodos()
      .then(data => {
        commit('endLoading')
        commit('fillTodos', data)
      })
      .catch(err => {
        commit('endLoading')
        handleError(err)
      })
  },
  addTodo ({ commit }, todo) {
    commit('startLoading')
    model.createTodo(todo)
      .then(data => {
        commit('addTodo', data)
        commit('endLoading')
        notify({
          content: '你又多了一件事要做'
        })
      }).catch(err => {
        commit('endLoading')
        handleError(err)
      })
  },
  updateTodo ({ commit }, { id, todo }) {
    commit('startLoading')
    model.updateTodo(id, todo)
      .then(data => {
        commit('updateTodo', { id, todo: data })
        commit('endLoading')
      }).catch(err => {
        handleError(err)
        commit('endLoading')
      })
  },
  deleteTodo ({ commit }, id) {
    commit('startLoading')
    model.deleteTodo(id)
      .then(data => {
        commit('deleteTodo', id)
        notify({
          content: '你又少了一件事要做'
        })
        commit('endLoading')
      }).catch(err => {
        handleError(err)
        commit('endLoading')
      })
  },
  deleteAllCompleted ({ commit, state }) {
    commit('startLoading')
    const ids = state.todos.filter(t => t.completed).map(t => t.id)
    model.deleteAllCompleted(ids)
      .then(() => {
        commit('deleteAllCompleted')
        commit('endLoading')
        notify({
          content: '清理一下~~~'
        })
      }).catch(err => {
        handleError(err)
        commit('endLoading')
      })
  },
  login ({ commit }, { username, password }) {
    commit('startLoading')
    return new Promise((resolve, reject) => {
      model.login(username, password)
        .then(data => {
          commit('doLogin', data)
          notify({
            content: '登录成功'
          })
          resolve()
          commit('endLoading')
        }).catch(err => {
          handleError(err)
          reject(err)
          commit('endLoading')
        })
    })
  }
}
