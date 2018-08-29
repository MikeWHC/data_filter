let store = [{
    "Ticketinfo": "免費參觀",
    "Zone": "三民區",
    "Px": "120.30211",
    "Py": "22.63961",
    "Add": "高雄市三民區建國二路318號",
    "Gov": "397000000A",
    "Class2": null,
    "Class1": "3",
    "Website": "",
    "Opentime": "週二至週日10:00-18:00，每週一公休",
    "Description": "高雄願景館的前身是日治時期興建的高雄市舊火車站，外觀是”和洋混合式建築”氣勢雄偉，內部則為西式的玄關及大廳。2002年為了配合鐵路、捷運、高鐵的三鐵共構，這棟老火車站建築物遷移到附近的空地上，並由市府規劃，以\"數位博物館\"的型式，其中歷史迴廊對於鐵道文化及往日風貌有一系列回顧，讓遊客可以重溫老車站的過往風華，而3D虛擬互動區則讓參觀者以虛擬實境的方式飛越高雄的重要景點並同時見證高雄的發展歷史。願景館是認識高雄過去與未來的最佳場所，而願景橋、鐵路文化棧道、風的祝福廣場…等公共藝術區也是遊客們最愛駐足與拍照留念的美麗景點。",
    "Remarks": "",
    "Parkinginfo_py": "0",
    "Parkinginfo_px": "0",
    "Name": "高雄願景館",
    "Level": null,
    "Picture1": "http://khh.travel/FileArtPic.ashx?id=705&w=1280&h=960",
    "Toldescribe": "高雄願景館的前身是日治時期興建的高雄市舊火車站，外觀是”和洋混合式建築”氣勢雄偉，內部則為西式的玄關及大廳。2002年為了配合鐵路、捷運、高鐵的三鐵共構，這棟老火車站建築物遷移到附近的空地上，並由市府規劃，以\"數位博物館\"的型式，其中歷史迴廊對於鐵道文化及往日風貌有一系列回顧，讓遊客可以重溫老車站的過往風華，而3D虛擬互動區則讓參觀者以虛擬實境的方式飛越高雄的重要景點並同時見證高雄的發展歷史。願景館是認識高雄過去與未來的最佳場所，而願景橋、鐵路文化棧道、風的祝福廣場…等公共藝術區也是遊客們最愛駐足與拍照留念的美麗景點。",
    "Changetime": "2015-06-10T15:40:33",
    "Tel": "886-7-2363357",
    "Picdescribe1": "高雄願景館?",
    "Travellinginfo": "",
    "_id": 1,
    "Id": "C1_397000000A_000009"
}]
//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
  };
let vm = new Vue({
    el: '.container-fluid',
    data: {
        names: [
            'Mike',
            'Peter',
            'Claire',
            'Gary'
        ],
        options: [],
        records: [],
        totalRecords: '',
        recordsPerPage: 20,
        currentPage: 1,
        recordsClass: [
            {"name":"文化類","id":"1"},
            {"name":"生態類","id":"2"},
            {"name":"古蹟類","id":"3"},
            {"name":"廟宇類","id":"4"},
            {"name":"藝術類","id":"5"},
            {"name":"小吃/特產類","id":"6"},
            {"name":"國家公園類","id":"7"},
            {"name":"國家風景區類","id":"8"},
            {"name":"休閒農業類","id":"9"},
            {"name":"溫泉類","id":"10"},
            {"name":"自然風景類","id":"11"},
            {"name":"遊憩類","id":"12"},
            {"name":"體育健身類","id":"13"},
            {"name":"觀光工廠類","id":"14"},
            {"name":"都會公園類","id":"15"},
            {"name":"森林遊樂區類","id":"16"},
            {"name":"林場類","id":"17"},
            {"name":"其他","id":"18"}
        ]
    },
    computed: {
        totalPages(){
            return parseInt(this.totalRecords / this.recordsPerPage) + 1
        }
    },
    methods: {
        onLocationChange(e) {
            // console.log(this) // Vue instance
            // console.log(e.currentTarget.value)
            let val = e.currentTarget.value,
                queryString = `&q={"Zone":"${val}"}`;
            this.currentPage = 1;
            this.getData(this.currentPage, queryString)
        },
        getData(page, queryString = '') {
            url = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';
            url += '&limit=20';
            url += '&offset=' + ((page - 1) * this.recordsPerPage);
            url += queryString;
            return fetch(url)
                    .then(res => res.json())
                    .then(res => {
                        this.records = res.result.records.map(x => {
                            x.isShortDesc = true;
                            return x
                        });
                        this.totalRecords = res.result.total;
                        console.log(this);
                        console.log(res.result.records);
                    })
        },
        changePage(index){
            this.getData(index);
            window.scrollY = 0
            this.currentPage = index;
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
        },
        sort(id){
            console.log(id);

        }
        
    },
    created() {
        let url = 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97';

        fetch(url)
            .then(res => res.json())
            .then(res => this.options = res.result.records.reduce((a, x) => {
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