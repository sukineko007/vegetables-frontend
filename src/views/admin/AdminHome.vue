<template>
    <div id="root">
        <AdminHeader />
        <div class="clearfix"></div>
        <section class="myrow">
            <nav>
                <AdminLeftNav />
            </nav>
            <section id="container">
                <keep-alive>
                    <transition name='el-fade-in'>
                        <router-view />
                    </transition>
                </keep-alive>
            </section>
        </section>

    </div>
</template>

<script>
import AdminHeader from './AdminHeader'
import AdminLeftNav from './AdminLeftNav'

export default {
    name: 'root',
    data() {
        return {
            msg: 'Hello Vue.js'
        }
    },
    components: {
        AdminHeader,
        AdminLeftNav
    }

}
</script>

<style  scoped>
    #root{
      height: 100%;
    }
    .clearfix{
      clear: both;
    }
    .myrow{
      height: 90.5%;
      margin-top: -1px;
    }

    .el-pager li .number{
      border: 1px solid gray!important;
      border-radius: 4px!important;
    }

    nav {
      width: 12%;
      height: 100%;
      float: left;
    }

    #container{
      width: 87%;
      height:100%;
      float: right;
      overflow-y: auto;
    }
</style>