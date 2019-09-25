<template>
    <div id="search">
        <headers title="国家/地区" @back="$goBack"></headers>
        <div class="positionF">
            <img class="search" src="../assets/img/quicklogin/search.png" alt="">
            <input class="input" type="text" placeholder="搜索国家/地区名字">
        </div>
        <div class="radiou">
            <div :class="classMethods(key)"  v-for="(item,key) in list"  :key="key" @click="changeRadiou($event)" ref="radiou">
                    <span class="title">{{item.title}}</span>
                    <span class="value">{{item.value}}</span>
                <span v-if="index==key" class="is-active" ></span>
            </div>
        </div>
    </div>
</template>

<script>
    import headers from './header'
    export default {
        components: {
            headers
        },
        data() {
            return {
                index:Number,
                list: [
                    {title: '中国', value: '（China）'},
                    {title: '中国', value: '（China）'},
                    {title: '中国', value: '（China）'},
                    {title: '中国', value: '（China）'},
                    {title: '中国', value: '（China）'},
                    {title: '中国', value: '（China）'},
                    {title: '中国', value: '（China）'},
                ],
            }
        },
        methods: {
            changeRadiou(e) {
            this.index=Number(e.target.classList[1])
            },
            classMethods(e){
               return `row ${e}`
            }
        },
    }
</script>

<style lang="scss">
    #search {
        .positionF {
            position: relative;
            width: 608px;
            margin: auto;

            .search {
                width: 36px;
                height: 36px;
                position: absolute;
                left: 33px;
                top: 40px;
            }

            .input {
                font-family: MicrosoftYaHei;
                background-color: #e4e4e4;
                color: #999999;
                width: 608px;
                height: 63px;
                opacity: 0.4;
                border: none;
                outline: none;
                border-radius: 30px;
                padding-left: 100px;
                margin: 24px 0;
            }
        }

        .radiou {
            .is-active{
                width: 51px;
                height: 52px;
                display: inline-block;
                background: red;
                float: right;
                background: url("../assets/img/quicklogin/user.png");
                background-size: contain;
            }
            .row {
                text-align: left;
                line-height: 95px;
                padding: 0 36px;
                background: #fff;
                border-bottom: 1px solid #dcdcdc;
                .title {
                    color: #464646;
                    margin-right:22px
                }
                .value {
                    color: #878787
                }
            }


        }
    }
</style>