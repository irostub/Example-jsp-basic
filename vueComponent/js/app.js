import SearchModel from './models/SearchModel.js'
import KeywordModel from './models/KeywordModel.js'
import HistoryModel from './models/HistoryModel.js'

import FormComponent from './components/FormComponent.js'
import ResultComponent from './components/ResultComponent.js'
import ListComponent from './components/ListComponent.js'
import TabComponent from './components/tabComponent.js'

new Vue({
  el: '#app',
  data: {
    query: '',
    submitted: false,
    tabs: ['추천 검색어', '최근 검색어'],
    selectedTab: '',
    keywords: [],
    history: [],
    searchResult: []
  },
  //vue인스턴스에서 component를 사용하기 위해선 components속성에서 정의한다.
  //keyValue로 사용할 디렉티브 명을 명시해주고 value로 바인딩할 component를 명시한다
  components:{
    'search-form' : FormComponent,
    'result-form' : ResultComponent,
    'list-form' : ListComponent,
    'tab-form' : TabComponent
  },
  created() {
    this.selectedTab = this.tabs[0]
    this.fetchKeyword()
    this.fetchHistory()
  },
  methods: {
    onSubmit(e) {
      this.query = e
      this.search()
    },
    onReset(e) {
      this.resetForm()
    },
    onClickKeyword(keyword) {
      this.query = keyword;
      this.search()
    },
    onClickTab(tab){
      this.selectedTab = tab
    },
    onClickRemoveHistory(keyword) {
      HistoryModel.remove(keyword)
      this.fetchHistory()
    },
    fetchKeyword() {
      KeywordModel.list().then(data => {
        this.keywords = data
      })
    },
    fetchHistory() {
      HistoryModel.list().then(data => {
        this.history = data
      })
    },
    search() {
      SearchModel.list().then(data => {
        this.submitted = true
        this.searchResult = data
      })
      HistoryModel.add(this.query)
      this.fetchHistory()
    },
    resetForm() {
      this.query = ''
      this.submitted = false
      this.searchResult = []
    }
  }
})