<template>
  <div class="pub_container">
    <div class="inner_wrapper">
      <div class="upper_form">
        <input type="text" placeholder="  标题" @focus="clearError()" v-model="title">
        <input type="number" placeholder="  标价"  v-model="unitPrice">
        <input type="number" placeholder="  售价" v-model="sellPrice">
        <input type="number" placeholder="发行量" v-model="capacity">
      </div>
      <div class="lower_form">
        <textarea placeholder="内容简介(最多4096个字符)" maxlength="4096" v-model="text"></textarea>
        <div class="btn btn_1"  @click="postarticle()">提交</div>
        <div class="btn btn_2" @click="closeModal()">取消</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'publish',
    data: function () {
      return {
        title: '',
        text: '',
        unitPrice: undefined,
        sellPrice: undefined,
        capacity: undefined,
        isError: false,
        errorMsg: ''
      }
    },
    components: {
    },
    methods: {
      postarticle: function () {
        let that = this
        // untest
        if (this.text.length > 4096) {
          this.$store.commit('callToast', {msgHeader: '警告', msgContent: '书籍内容简介长度要小于4096字节', _confirmfunc: '确定', _cancelfunc: '关闭', deals: undefined, contract: 4})
          return
        }
        // title, text, unitPrice, sellPrice, capacity
        let tagArr = this.pushInEvent
        that.$store.dispatch('invokeContract', {
          type: 1000,
          fee: '10000000',
          args: tagArr,
          that: that,
          callback: function (err, res) {
            if (err) {
              return
            }
            that.$store.commit('callToast', {msgHeader: '成功！', msgContent: '发布书籍成功！大约十秒后看到更新', _confirmfunc: '了解', _cancelfunc: '关闭', deals: undefined, contract: 4})
            that.$router.back()
          }
        })
      },
      clearError: function () {
        this.isError = false
        this.errorMsg = ''
      },
      closeModal: function () {
        // this.$router.push('/news')
        this.$router.back()
      },
      // 输入侦测
      trim: function (m) {
        while ((m.length > 0) && (m.charAt(0) === ' ')) {
          m = m.substring(1, m.length)
        }
        while ((m.length > 0) && (m.charAt(m.length - 1) === ' ')) {
          m = m.substring(0, m.length - 1)
        }
        return m
      },
      // 按键结束处理标签内容
      dealWithTags: function () {
        let tag = this.tags
        this.trim(tag)
        if (tag.indexOf(' ') !== -1) {
          this.tags = tag.replace(' ', ',')
        }
      }
    },
    computed: {
      pushInEvent: function () {
        let arr = []
        let aftTitle = this.title.trim()
        arr.push(aftTitle)
        // 格式化text($(_temp))
        let texta = this.text
        texta.replace(/\n/g, 'duri')
        arr.push(texta)
        arr.push(this.unitPrice)
        arr.push(this.sellPrice)
        arr.push(this.capacity)
        return arr
      }
    },
    created: function () {
      if (this.$store.state.isLogin === false) {
        console.log('判断成功')
        this.$router.push('/top')
      }
    }
  }
</script>

<style lang="" scoped>
  .pub_container{
    min-width: 1000px;
    width: 80%;
    min-height: 700px;
    height: 100%;
    margin: 0 auto;
    overflow: hidden;
    padding-bottom: 210px;
  }
  .inner_wrapper{
    width: 70%;
    margin: 5% auto 0 auto;
  }
  .upper_form{
    width: 100%;
    border-left: 6px solid rgb(220, 220, 220);
  }
  .upper_form input{
    font-size: 24px;
    height: 50px;
    border: 1px solid rgb(220, 220, 220);
    background-color: rgb(240, 240, 240);
    width: 90%;
    display: block;
    margin-left: 25px;
    margin-top: 25px;
  }
  .lower_form{
    width: 100%;
    margin-top: 25px;
  }
  .lower_form textarea{
    font-size: 24px;
    width: 90%;
    height: 250px;
    margin-left: 31px;
    float: left;
  }
  .btn{
    font-size: 25px;
    display: inline-block;
    margin: 40px 30px;
    width: 110px;
    height: 45px;
    line-height: 45px;
    vertical-align: baseline;
    border-radius: 8px;
    cursor: pointer;
  }
  .btn_1{
    border: 1px solid rgb(210, 229, 244);
    color: rgb(102, 146, 217);
    background-color: rgb(210, 229, 244);
    margin-right: 65px;
  }
  .btn_2{
    border: 1px solid rgb(210, 229, 244);
    color: rgb(102, 146, 217);
    background-color: #fff;
  }
  .err{
    color: red;
    font-size: 20px;
  }
  @media screen and (max-width: 1441px) {
    .pub_container{
      width: 60%;
      min-height: 700px;
      height: 100%;
      margin: 0 auto;
      overflow: hidden;
      padding-bottom: 210px;
    }
    .upper_form{
      border-left: 2px solid rgb(220, 220, 220);
    }
    .upper_form input{
      font-size: 14px;
      height: 28px;
      border: 1px solid rgb(220, 220, 220);
      background-color: rgb(240, 240, 240);
      width: 90%;
      display: block;
      margin-left: 12px;
      margin-top: 12px;
    }
    .lower_form textarea{
      font-size: 14px;
      line-height: 28px;
      width: 90%;
      height: 250px;
      margin-left: 14px;
      resize: none;
    }
    .btn{
      font-size: 14px;
      display: inline-block;
      margin: 40px 30px;
      width: 60px;
      height: 28px;
      line-height: 28px;
      vertical-align: baseline;
      border-radius: 8px;
      cursor: pointer;
    }
  }
</style>
