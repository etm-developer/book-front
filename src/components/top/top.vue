<template>
  <div class="main-wrap">
    <el-table :data="topArticleList" border fit highlight-current-row>
      <el-table-column align="center" label='标题' width="95">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ownerId}}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="单价" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.unitPrice}}
        </template>
      </el-table-column>
      <el-table-column label="售价" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.sellPrice}}
        </template>
      </el-table-column>

      <el-table-column label="库存" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.capacity - scope.row.sellNumber }}
        </template>
      </el-table-column>

      <el-table-column label="销量" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.sellNumber }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="action" label="操作" width="230">
        <template slot-scope="scope">
          <span>
            <el-button type="primary"  v-if="scope.row.sellState =='1'" size="mini" @click="voteBtn(scope.row)">购买</el-button>
            <el-button v-if="scope.row.sellState =='1'" size="mini" type="danger" @click="handleModifyState(scope.row,'0')">下架</el-button>
            <el-button v-if="scope.row.sellState =='0'" size="mini" @click="handleModifyState(scope.row,'1')">上架</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="购买书籍" :visible.sync="dialogFormVisible">
      <div>购买书籍需要消耗{{buyCost}}ETM</div>
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 200px; margin-left:50px;'>        

        <el-form-item label="购买数量" prop="num">
          <el-input type="number" v-model="temp.num"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="doBuy">购买</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  // import { mapGetters } from 'vuex'
  import topList from './topList/topList'
  import {fetchBookList, fetchBook} from '@/api/book'

  export default {
    name: 'top',
    components: {
      topList
    },
    data: function () {
      return {
        awardNum: undefined,
        listQuery: {},
        topArticleList: [],
        book: undefined,
        dialogFormVisible: false,
        temp: {
          bookId: undefined,
          price: 0,
          num: 1
        }
      }
    },
    methods: {
      // 刷新（重新拉取）事件
      toReFresh: function (data) {
        let that = this
        setTimeout(function () {
          that.$store.dispatch('getAllarticles', {
            sortBy: undefined,
            limit: '',
            offset: '',
            that: that
          })
        }, 10000)
      },
      voteBtn: function (row) {
        let that = this
        if (that.$store.state.isLogin === false) {
          that.$store.commit('callToast', {msgHeader: '注意!', msgContent: '仅当您登录后才能购买', _confirmfunc: '去登录', _cancelfunc: '关闭', deals: undefined, contract: 3})
          return
        }
        this.temp.num = 1
        this.temp.bookId = row.id
        this.temp.price = parseInt(row.sellPrice)
        this.dialogFormVisible = true
        // console.log('id : ' + row.id + ', sellPrice: ' + row.sellPrice)
        // this.$store.commit('callInputToast', {msgHeader: '打赏', msgContent: '请输入购买数量', _confirmfunc: null, _cancelfunc: null, deals: row.sellPrice, args: row.id, contract: 2})
        // // 无反馈强制刷新
        // setTimeout(function () {
        //   that.$emit('reFresh')
        // }, 20000)
      },
      doBuy: function () {
        const that = this
        var args = []
        args.push(this.temp.bookId)
        args.push(this.temp.num + '')
        this.$store.dispatch('invokeContract', {
          type: 1002,
          fee: '10000000',
          args: args,
          that: this,
          callback: function (err, msg) {
            if (err) {
              return
            }
            that.$store.commit('callToast', {msgHeader: '成功！', msgContent: '购买成功！大约十秒后将看到更新信息', _confirmfunc: null, _cancelfunc: null})
            that.$emit('reFresh')
          }
        })
        //
      },
      handleModifyState: function (row, state) {
        const that = this
        var args = []
        args.push(row.id + '')
        args.push(state + '')
        this.$store.dispatch('invokeContract', {
          type: 1001,
          fee: '10000000',
          args: args,
          that: this,
          callback: function (err, msg) {
            if (err) {
              return
            }
            row.sellState = state
            that.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            // that.$store.commit('callToast', {msgHeader: '成功！', msgContent: '更新成功！大约十秒后将看到更新信息', _confirmfunc: null, _cancelfunc: null})
            that.$emit('reFresh')
          }
        })
      },
      getList: function () {
        // this.listLoading = true
        fetchBookList(this.listQuery).then(response => {
          this.topArticleList = response.data.books
          console.log(this.topArticleList)
          // this.total = response.page.countTotal
        })
      },
      getBook: function (id) {
        // this.listLoading = true
        fetchBook(id).then(response => {
          this.book = response.data
          // this.total = response.page.countTotal
        })
      },
      // 实时修改对象片段
      shiftPiece: function (obj) {
        let newObj = {}
        newObj = obj
        newObj.isSelected = !newObj.isSelected
        return newObj
      },
      // 动画开关
      toggleAward: function (index, item) {
        this.switchGroup.splice(index, 1, this.shiftPiece(item))
      }
    },
    // computed: mapGetters({
    //  topArticleList: 'topArticleList'
    // }),
    computed: {
      buyCost: function () {
        let price = parseInt(this.temp.price)
        if (price) {
          return this.temp.num * this.temp.price
        }
        return 0
      }
    },
    created: function () {
      // 输出$state list内容
      // this.$store.dispatch('getAllarticles', {
      //   sortBy: undefined,
      //   limit: '',
      //   offset: '',
      //   that: this
      // })
      this.getList()
    }
  }
</script>

<style scoped>
  .main-wrap{
    width: 65.5%;
    margin: auto auto;
    min-height: 900px;
    min-width: 1237px;
    height: 100%;
    overflow: hidden;
    padding-bottom: 150px;
  }
  .main-wrap ul{
    margin-top: 20px;
    list-style: none;
  }
  .main-wrap ul li{
    position: relative;
    min-width: 1237px;
    width: 100%;
    height: 75px;
    background-color: #fff;
    padding: 0px;
    text-align: left;
  }
   @media screen and (max-width: 1441px) {
    /* 1360屏幕下 */
    .main-wrap{
      width: 80%;
      min-height: 700px;
      padding-bottom: 75px;
      min-width: 1092px;
    }
    .main-wrap ul li{
      height: 68px;
      min-width: 860px;
    }
  }
</style>
