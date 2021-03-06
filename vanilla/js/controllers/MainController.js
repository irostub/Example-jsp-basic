import FormView from '../views/FormView.js'
import ResultView from '../views/ResultView.js'
import TabView from '../views/TabView.js'
import KeywordView from '../views/KeywordView.js'
import HistoryView from '../views/HistoryView.js'

import SearchModel from '../models/SearchModel.js'
import KeywordModel from '../models/KeywordModel.js'
import HistoryModel from '../models/HistoryModel.js'

const tag = '[MainController]'

export default{
    init(){
        console.log(tag, 'init()')
        FormView.setup(document.querySelector('form'))

        //@submit 이벤트가 발생했을 때 onSubmit함수 호출
        .on('@submit', e => this.onSubmit(e.detail.input))
        .on('@reset', () => this.onReset())

        ResultView.setup(document.querySelector('#search-result'))

        TabView.setup(document.querySelector('#tabs'))
        .on('@tabClick', e => this.onClickTab(e.detail.tabName))

        KeywordView.setup(document.querySelector('#search-keyword'))
        .on('@keywordClick', e => this.onClickKeyword(e.detail.keyword))

        HistoryView.setup(document.querySelector('#search-history'))
        .on('@keywordClick', e => this.onClickHitory(e.detail.history))
        .on('@remove', e => this.onRemoveHistory(e.detail.keyword))
        this.selectedTab = '추천 검색어'
        this.renderView()
    },

    renderView(){
        console.log('renderView()')
        TabView.setActiveTab(this.selectedTab)

        if(this.selectedTab === '추천 검색어'){
            this.fetchSearchKeyword()
            HistoryView.hide()
        }else{
            this.fetchHistory()
            KeywordView.hide()
        }
        ResultView.hide()
    },

    fetchSearchKeyword(){
        KeywordModel.list().then(data=>{
            KeywordView.render(data)
        })
    },

    fetchHistory(){
        HistoryModel.list().then(data=>{
            HistoryView.render(data).bindEvent()
        })
    },

    search(query){
        console.log(tag, 'search()', query)
        HistoryModel.add(query)
        SearchModel.list(query).then(data=>{
            this.onSearchResult(data)
        })
    },

    onSubmit(input){
        console.log(tag, 'onSubmit()', input)
        this.search(input)
    },

    onReset(){
        console.log(tag, 'onReset()')
        this.renderView()
    },

    onSearchResult(data){
        KeywordView.hide()
        TabView.hide()
        ResultView.render(data)
    },
    
    onClickTab(tabName){
        this.selectedTab = tabName
        this.renderView()
    },

    onClickKeyword(keyword){
        this.search(keyword)
        FormView.setKeyword(keyword)
    },

    onClickHitory(history){
        this.search(history)
    },

    onRemoveHistory(keyword){
        console.log(keyword)
        HistoryModel.remove(keyword)
        this.renderView()
    }
}