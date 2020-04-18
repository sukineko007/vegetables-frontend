<template>
    <div id="root">
        <CustomHeader />
        <nav>
            <CustomHeadNav />
        </nav>
        <div class="clearfix"></div>
        <section class="myrow">
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
import CustomHeader from './CustomHeader'
import CustomHeadNav from './CustomHeadNav'

export default {
    name: 'root',
    data() {
        return {
            msg: 'Hello Vue.js'
        }
    },
    components: {
        CustomHeader,
        CustomHeadNav
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
      height: 85%;
      margin-top: -1px;
    }

    .el-pager li .number{
      border: 1px solid gray!important;
      border-radius: 4px!important;
    }

    nav {
      width: 100%;
      height: 10%;
      float: left;
    }

    #container{
      width: 100%;
      height:100%;
      float: right;
      overflow-y: auto;
    }
</style>