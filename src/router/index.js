import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Toplist from '../views/Toplist'
import My from '../views/My'
import Playlist from '../views/Playlist'
import Newalbum from '../views/Newalbum'
import Artist from '../views/Artist'
import playlistdetail from '../views/playlist/playlistdetail'
import singer from '../views/singer'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/toplists',
    name: 'Toplist',
    component: Toplist
  },
  {
    path: '/playlist',
    name: 'Playlist',
    component: Playlist,
    children: [{
      path: '/playlist/playlistdetail/:id',
      name: 'detail',
      component: playlistdetail // res => require(['@views/playlist/playlistdetail'], res)
    }]
  },
  {
    path: '/artist',
    name: 'Artist',
    component: Artist
  },
  {
    path: '/newalbum',
    name: 'Newalbum',
    component: Newalbum
  },
  {
    path: '/my',
    name: 'My',
    component: My
  },
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/singer',
    name: 'singer',
    component: singer
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
