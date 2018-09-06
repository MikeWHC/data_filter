let recordsClass = [
        {"name":"文化類","id":"1"},
        {"name":"生態類","id":"2"},
        {"name":"古蹟類","id":"3"},
        {"name":"廟宇類","id":"4"},
        {"name":"藝術類","id":"5"},
        {"name":"小吃/特產類","id":"6"},
        // {"name":"國家公園類","id":"7"},
        {"name":"國家風景區類","id":"8"},
        {"name":"休閒農業類","id":"9"},
        {"name":"溫泉類","id":"10"},
        {"name":"自然風景類","id":"11"},
        {"name":"遊憩類","id":"12"},
        {"name":"體育健身類","id":"13"},
        {"name":"觀光工廠類","id":"14"},
        {"name":"都會公園類","id":"15"},
        // {"name":"森林遊樂區類","id":"16"},
        // {"name":"林場類","id":"17"},
        {"name":"其他","id":"18"}
    ],
    vm,
    api_url = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',
    reloadData = function(){ 
    }

Math.easeInOutQuad = function (t, b, c, d) {
    //t = current time
    //b = start value
    //c = change in value
    //d = duration
    t /= (d / 2);
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
  };

vm = new Vue({
    el: '.container-fluid',
    data: {
        districts: [],
        records: [],
        totalRecords: '',
        recordsPerPage: 10,
        currentPage: 1,
        recordsClass: recordsClass,
        searchCondition: {
            Zone: '',
            Class1: ''
        }
    },
    computed: {
        totalPages(){
            return parseInt(this.totalRecords / this.recordsPerPage) + 1
        }
    },
    methods: {
        onDistrictChange(e) {
            let val = e.currentTarget.value;

            this.searchCondition.Zone = val;
            this.currentPage = 1;
            // 未選擇就全部查
            this.getData(this.currentPage)
        },
        onChecked(e, id){
            let target = e.currentTarget,            
                isChecked = target.checked,
                parentEl,
                checkboxes;
            if (isChecked) {
                parentEl = target.closest('.col')
                checkboxes = parentEl.querySelectorAll(':checked')
                for(box of checkboxes) {
                    box.checked = box === target ? true : false;
                }
                this.searchCondition.Class1 = id;
            }else{
                this.searchCondition.Class1 = '';
            }
            this.currentPage = 1;
            this.getData(this.currentPage)
        },
        getData(page) {
            let url = `${api_url}&limit=${this.recordsPerPage}&offset=${(page - 1) * this.recordsPerPage}`,
                queryString = {},
                isEmpty = true;

            for(key in this.searchCondition){
                let value = this.searchCondition[key]
                if(value !== '') {
                    queryString[key] = value;
                    isEmpty = false
                }
            }
            if (!isEmpty) url += `&q=${JSON.stringify(queryString)}`;

            return fetch(url)
                    .then(res => res.json())
                    .then(res => {
                    
                        this.records = res.result.records.map(x => {
                            x.isShortDesc = true;
                            return x
                        });
                        this.totalRecords = res.result.total;
                    })
        },
        changePage(pageIndex){
            this.getData(pageIndex);
            this.currentPage = pageIndex;
            this.scrollTo(document.documentElement, 0, 1000)
        },
        scrollTo(element, to, duration) {
            var start = element.scrollTop,
                change = to - start,
                currentTime = 0,
                increment = 20;
                
            var animateScroll = function(){        
                currentTime += increment;
                var val = Math.easeInOutQuad(currentTime, start, change, duration);
                element.scrollTop = val;
                if(currentTime < duration) {
                    setTimeout(animateScroll, increment);
                }
            };
            animateScroll();
        }   
    },
    created() {
        // 頁面載入時，取得所有地區和當頁資料   
        fetch(api_url)
            .then(res => res.json())
            .then(res => this.districts = res.result.records.reduce((a, x) => {
                if(a.indexOf(x.Zone) === -1) a.push(x.Zone);
                return a
            }, []));
        this.getData(this.currentPage)
    }
})

Vue.component('card', {
    props: ['item'],
    template: `<div class="row block">
        <div class="col-sm-4">
            <img :src="item.Picture1" alt="">
        </div>
        <div class="col-sm-8">
            <h2>{{item.Name}}</h2>
            <p>{{item.isShortDesc ? item.Description.slice(0,99) : item.Description}}<a href="" @click.prevent="$emit('load-text')">{{item.isShortDesc ? ' ...更多' : ' 收起'}}</a></p>
            <div class="tags">
                <div class="tag">票價資訊： {{item.Ticketinfo ? item.Ticketinfo : '無'}}</div>
                <div class="tag">開放時間： {{item.Opentime ? item.Opentime : '無'}}</div>
                <div class="tag">地區： {{item.Zone ? item.Zone : '無'}}</div>
                <div class="tag">地址： {{item.Add ? item.Add : '無'}}</div>
            </div>
        </div>
    </div>`

})

// 未解的問題: 
// 1. 查詢結果為0會噴warning
// 2. 根據第一個篩選條件，再將另一個條件篩出可能選項，e.g. 選了地區篩出可能的景點類別