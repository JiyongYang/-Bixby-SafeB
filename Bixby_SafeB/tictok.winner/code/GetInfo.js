
/*
* 대피소 정보
*/

// 1. 번 기본발화 :: 주변 대피소 알려줘~ (디폴트 2km 반경 내)
// 2. 번 기본발화 + 수량 :: 주변 대피소 4개만 알려줘 ~ (사용자 입력 개수만큼) => 삭제함 (이유: 의미 없음)
// 3. 번 지역 + 기본 발화 :: 구미에 있는 대피소 알려줘 ~ 
// 4. 번 most + 기본발화:: 가장 가까운 대피소 알려줘 ~(기본 문장) 제일 가까운 한곳 출력


//************************************************************* */
function getShelterInfo(near, area, most, point, self){
  const console = require('console');
  const config = require('config');
  const http = require('http');

  let options = {format: 'json'};
  let url = config.get('remote.url');
  let googleMapURL = "https://www.google.com/maps/place/";
  let googleNaviURL = "https://www.google.com/maps/dir/";

  
  let results = new Object();
  results.shelter = new Array();

  // 1. 번 기본발화 :: 주변 대피소 알려줘~ (디폴트 2km 반경 내)
  if((near != undefined) && (most == undefined) && (area == undefined)){
    let lat = point.point.latitude;
    let lon = point.point.longitude;
    console.log("1번 대피소 발화");
    let parseURL = 'cate=shelter&&cmd=searchByLatLon&&' 
    + 'lat=' + lat + '&&lon=' + lon + '&&dist=2';
    let response = http.getUrl(url + parseURL, options);
   
    for(let i in response){
      let shelter = new Object();

      if(self.nameInfo != undefined){
        if(self.nameInfo.nickName){
          shelter.username = self.nameInfo.nickName;
        }else{
          shelter.username = self.nameInfo.structuredName;
        }  
      }else{
        shelter.username = '사용자';
      }
      let point = new Object();
      shelter.point = new Object();

      let mypoint = new Object();
      shelter.mypoint = new Object();
      

      let latitude = response[i].lat;
      let longitude = response[i].lon;
     
      shelter.sheltername = response[i].facilityName;
      shelter.address = response[i].detailAddress;
      shelter.url = googleMapURL + latitude + "," + longitude;
      shelter.flag = 1;
      if(response[i].dist != undefined)
        shelter.dist = Math.round(response[i].dist.toFixed(3) * 1000);
      else shelter.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
      //Tmap url 스키마 사용 안됨
      //shelter.naviurl = 'tmap://?rGoName=' + response[i].facilityName + '&rGoX=' + longitude +'&rGoY=' + latitude;
      //Duam url 스키마
      shelter.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';
      //shelter.naviurl = googleNaviURL + lat + "," + lon + "/" + latitude + "," + longitude;
      shelter.phonenumber = response[i].managementTelNo;
      shelter.managementname = response[i].managementGroupName;
      point.latitude = latitude;
      point.longitude = longitude;
      shelter.point.point = point;
      mypoint.latitude = lat;
      mypoint.longitude = lon;
      shelter.mypoint.point = mypoint;
      shelter.sheltercount = response.length;

      results.shelter.push(shelter);
    }
  }
  //************************************************************* */

  //************************************************************* 
  //:: 삭제 부분 -> 대피소를 사용자가 원하는 개수 만큼 알려주는 건 사용성이 낮음 

  // 2. 번 기본발화 + 수량 :: 주변 대피소 4개만 알려줘 ~ (사용자 입력 개수만큼)
  /* else if((near != undefined) && (count != undefined) && (area == undefined)){
    let point = new Object();
    shelter.point = new Object();

    let mypoint = new Object();
    shelter.mypoint = new Object();

    let lat = point.point.latitude;
    let lon = point.point.longitude;
    console.log("2번 발화");
    let parseURL = 'cate=shelter&&cmd=searchByLatLonCnt&&' + 'lat=' + lat + '&&lon=' + lon + '&&cnt=' + count;
    let response = http.getUrl(url + parseURL, options);

    for(let i in response){
      let shelter = new Object();

      if(self.nameInfo != undefined){
        if(self.nameInfo.nickName){
          shelter.username = self.nameInfo.nickName;
        }else{
          shelter.username = self.nameInfo.structuredName;
        }  
      }else{
        shelter.username = '사용자';
      }

      let point = new Object();
      shelter.point = new Object();

      let mypoint = new Object();
      shelter.mypoint = new Object();

      let latitude = response[i].lat;
      let longitude = response[i].lon;
     
      shelter.sheltername = response[i].facilityName;
      shelter.address = response[i].detailAddress;
      shelter.url = googleMapURL + latitude + "," + longitude;
      shelter.flag = 2;
      if(response[i].dist != undefined)
        shelter.dist = Math.round(response[i].dist.toFixed(3) * 1000);
      else shelter.dist = 0;
      shelter.naviurl = googleNaviURL + lat + "," + lon + "/" + latitude + "," + longitude;
      shelter.phonenumber = response[i].managementTelNo;
      shelter.managementname = response[i].managementGroupName;
      point.latitude = latitude;
      point.longitude = longitude;
      shelter.point.point = point;
      mypoint.latitude = lat;
      mypoint.longitude = lon;
      shelter.mypoint.point = mypoint;
      shelter.sheltercount = response.length;

      results.shelter.push(shelter);
    }
  
  }*/
  

  // 3. 번 지역 + 기본 발화 구미에 있는 대피소 알려줘 ~ 
  else if((near == undefined) && (most == undefined ) && (area != undefined)){
    let lat = point.point.latitude;
    let lon = point.point.longitude;
    let parseURL = 'cate=shelter&&cmd=searchAll';
    let response = http.getUrl(url + parseURL, options);
    console.log("3번 대피소 발화");
    for(let i in response){
      let shelter = new Object();
      if(response[i].detailAddress.includes(area)){
        if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            shelter.username = self.nameInfo.nickName;
          }else{
            shelter.username = self.nameInfo.structuredName;
          }  
        }else{
            shelter.username = '사용자';
        }

        let point = new Object();
        shelter.point = new Object();

        let mypoint = new Object();
        shelter.mypoint = new Object();
 

        let latitude = response[i].lat;
        let longitude = response[i].lon;

        shelter.area = area;
        shelter.sheltername = response[i].facilityName;
        shelter.address = response[i].detailAddress;
        shelter.url = googleMapURL + latitude + "," + longitude;
        shelter.flag = 3;
        if(response[i].dist != undefined)
          shelter.dist = Math.round(response[i].dist.toFixed(3) * 1000);
        else shelter.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
        shelter.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';
        shelter.phonenumber = response[i].managementTelNo;
        shelter.managementname = response[i].managementGroupName;
        point.latitude = latitude;
        point.longitude = longitude;
        shelter.point.point = point;
        mypoint.latitude = lat;
        mypoint.longitude = lon;
        shelter.mypoint.point = mypoint;

        results.shelter.push(shelter);
      }
    }
    for(let i in results.shelter) results.shelter[i].sheltercount = results.shelter.length;
  }

//**********************************************************
// :: 삭제부분
    /*if(count != undefined){
      console.log("3번 발화 (개수 있음)");
      let tempCount = 0;
      for(let i in response){
        let shelter = new Object();
        if(response[i].detailAddress.includes(area)){
          if(self.nameInfo != undefined){
            if(self.nameInfo.nickName){
              shelter.username = self.nameInfo.nickName;
            }else{
              shelter.username = self.nameInfo.structuredName;
            }  
          }else{
            shelter.username = '사용자';
          }

          let point = new Object();
          shelter.point = new Object();

          let mypoint = new Object();
          shelter.mypoint = new Object();
          let latitude = response[i].lat;
          let longitude = response[i].lon;
     
          shelter.sheltername = response[i].facilityName;
          shelter.address = response[i].detailAddress;
          shelter.url = googleMapURL + latitude + "," + longitude;
          shelter.flag = 3;
          if(response[i].dist != undefined)
            shelter.dist = Math.round(response[i].dist.toFixed(3) * 1000);
          else shelter.dist = 0;
          shelter.naviurl = googleNaviURL + lat + "," + lon + "/" + latitude + "," + longitude;
          shelter.phonenumber = response[i].managementTelNo;
          shelter.managementname = response[i].managementGroupName;
          point.latitude = latitude;
          point.longitude = longitude;
          shelter.point.point = point;
          mypoint.latitude = lat;
          mypoint.longitude = lon;
          shelter.mypoint.point = mypoint;
          shelter.sheltercount = count;

          results.shelter.push(shelter);
          tempCount += 1;
          if(tempCount==count) break;
        }
      }
    // 구미에 있는 대피소 알려줘 (수량 없을 때)
    }else{ */

  // 4. 번 가장 가까운 대피소 알려줘 (기본 문장) 제일 가까운 한곳 출력 
  else if((near != undefined) && (most != undefined) && (area == undefined)){
    let lat = point.point.latitude;
    let lon = point.point.longitude;
    console.log("4번 대피소 발화");
    let parseURL = 'cate=shelter&&cmd=searchByLatLonCnt&&lat='+ lat + '&&lon=' + lon +'&&cnt=1';
    let response = http.getUrl(url + parseURL, options);
    for(let i in response){
      let shelter = new Object();

      if(self.nameInfo != undefined){
        if(self.nameInfo.nickName){
          shelter.username = self.nameInfo.nickName;
        }else{
          shelter.username = self.nameInfo.structuredName;
        }  
      }else{
        shelter.username = '사용자';
      }
 
      let point = new Object();
      shelter.point = new Object();

      let mypoint = new Object();
      shelter.mypoint = new Object();
      let latitude = response[i].lat;
      let longitude = response[i].lon;
     
      shelter.sheltername = response[i].facilityName;
      shelter.address = response[i].detailAddress;
      shelter.url = googleMapURL + latitude + "," + longitude;
      shelter.flag = 4;
      if(response[i].dist != undefined)
        shelter.dist = Math.round(response[i].dist.toFixed(3) * 1000);
      else shelter.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
      shelter.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';
      shelter.phonenumber = response[i].managementTelNo;
      shelter.managementname = response[i].managementGroupName;
      point.latitude = latitude;
      point.longitude = longitude;
      shelter.point.point = point;
      mypoint.latitude = lat;
      mypoint.longitude = lon;
      shelter.mypoint.point = mypoint;
      shelter.sheltercount = response.length;

      results.shelter.push(shelter);
    }
  }
  return results;
}




/*
* 약국 정보
*/

// 1. 번 기본발화 :: 주변 약국 알려줘 ~ (디폴트 5km 반경 내)
// 2. 번 시간 + 기본발화 (디폴트 5km 반경 내, 20 개 정보) 

//************************************************************* */

// 1. 번 기본발화 주변 약국 알려줘 ~
function getPharmacyInfo(near, guidance, area, point, most, self, hour, min, amorpm){
  const console = require('console');
  const config = require('config');
  const http = require('http');

  let options = {format: 'json'};
  let url = config.get('remote.url');
  let googleMapURL = "https://www.google.com/maps/place/";
  let googleNaviURL = "https://www.google.com/maps/dir/";
  console.log("1번 약국 발화");
  let results = new Object();
  results.pharmacy = new Array();

    if((near != undefined) && (most == undefined) && (area == undefined)){
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let parseURL = 'cate=pharmacy&&cmd=searchByLatLonDist&&lat='+ lat + '&&lon=' + lon +'&&dist=5';
      let response = http.getUrl(url + parseURL, options);

      for(let i in response){
        let pharmacy = new Object();

        if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            pharmacy.username = self.nameInfo.nickName;
          }else{
            pharmacy.username = self.nameInfo.structuredName;
          }  
        }else{
          pharmacy.username = '사용자';
        }

        let point = new Object();
        pharmacy.point = new Object();

        let mypoint = new Object();
        pharmacy.mypoint = new Object();

        let latitude = response[i].lat;
        let longitude = response[i].lon;

        pharmacy.pharmacyname = response[i].name;
        pharmacy.address = response[i].address;
        pharmacy.tel = response[i].tel;
        if(response[i].dist != undefined)
            pharmacy.dist = Math.round(response[i].dist.toFixed(3) * 1000);
        else pharmacy.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
        pharmacy.url = googleMapURL + latitude + "," + longitude;
        pharmacy.flag = 1;
        pharmacy.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

        point.latitude = latitude;
        point.longitude = longitude;
        pharmacy.point.point = point;

        mypoint.latitude = lat;
        mypoint.longitude = lon;
        pharmacy.mypoint.point = mypoint;

        pharmacy.pharmacycount = response.length;

        pharmacy.dayofweek = getDay('오늘');
        pharmacy.monopentime = insert(response[i].monO, 2, ':');
        pharmacy.monclosetime = insert(response[i].monC, 2, ':');
        pharmacy.tueopentime = insert(response[i].tueO, 2, ':');
        pharmacy.tueclosetime = insert(response[i].tueC, 2, ':');
        pharmacy.wedopentime = insert(response[i].wedO, 2, ':');
        pharmacy.wedclosetime = insert(response[i].wedC, 2, ':');
        pharmacy.thuopentime = insert(response[i].thuO, 2, ':');
        pharmacy.thuclosetime = insert(response[i].thuC, 2, ':');
        pharmacy.friopentime = insert(response[i].friO, 2, ':');
        pharmacy.friclosetime = insert(response[i].friC, 2, ':');
        pharmacy.satopentime = insert(response[i].satO, 2, ':');
        pharmacy.satclosetime = insert(response[i].satC, 2, ':');
        pharmacy.sunopentime = insert(response[i].sunO, 2, ':');
        pharmacy.sunclosetime = insert(response[i].sunC, 2, ':');
      
        results.pharmacy.push(pharmacy);
      }
    }else if((near != undefined) && (most != undefined) && (area == undefined)){
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      console.log("most 약국 발화");
      let parseURL = 'cate=pharmacy&&cmd=searchByLatLonCnt&&lat='+ lat + '&&lon=' + lon +'&&cnt=1';
      let response = http.getUrl(url + parseURL, options);

      for(let i in response){
        let pharmacy = new Object();

        if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            pharmacy.username = self.nameInfo.nickName;
          }else{
            pharmacy.username = self.nameInfo.structuredName;
          }  
        }else{
          pharmacy.username = '사용자';
        }

        let point = new Object();
        pharmacy.point = new Object();

        let mypoint = new Object();
        pharmacy.mypoint = new Object();

        let latitude = response[i].lat;
        let longitude = response[i].lon;

        pharmacy.pharmacyname = response[i].name;
        pharmacy.address = response[i].address;
        pharmacy.tel = response[i].tel;
        if(response[i].dist != undefined)
            pharmacy.dist = Math.round(response[i].dist.toFixed(3) * 1000);
        else pharmacy.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
        pharmacy.url = googleMapURL + latitude + "," + longitude;
        pharmacy.flag = 4;
        pharmacy.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

        point.latitude = latitude;
        point.longitude = longitude;
        pharmacy.point.point = point;

        mypoint.latitude = lat;
        mypoint.longitude = lon;
        pharmacy.mypoint.point = mypoint;

        pharmacy.pharmacycount = response.length;

        pharmacy.dayofweek = getDay('오늘');
        pharmacy.monopentime = insert(response[i].monO, 2, ':');
        pharmacy.monclosetime = insert(response[i].monC, 2, ':');
        pharmacy.tueopentime = insert(response[i].tueO, 2, ':');
        pharmacy.tueclosetime = insert(response[i].tueC, 2, ':');
        pharmacy.wedopentime = insert(response[i].wedO, 2, ':');
        pharmacy.wedclosetime = insert(response[i].wedC, 2, ':');
        pharmacy.thuopentime = insert(response[i].thuO, 2, ':');
        pharmacy.thuclosetime = insert(response[i].thuC, 2, ':');
        pharmacy.friopentime = insert(response[i].friO, 2, ':');
        pharmacy.friclosetime = insert(response[i].friC, 2, ':');
        pharmacy.satopentime = insert(response[i].satO, 2, ':');
        pharmacy.satclosetime = insert(response[i].satC, 2, ':');
        pharmacy.sunopentime = insert(response[i].sunO, 2, ':');
        pharmacy.sunclosetime = insert(response[i].sunC, 2, ':');
      
        results.pharmacy.push(pharmacy);
      }
    }
 
  return results;
}

// 2. 번 기본발화 + 시간 
function getPharmacyInfoByDate(near, guidance, area, point, most,self, kinds, date, hour, min, amorpm){
  const console = require('console');
  const config = require('config');
  const http = require('http');
  console.log("2번 약국 발화 + (시간)");
  let options = {format: 'json'};
  let url = config.get('remote.url');
  let googleMapURL = "https://www.google.com/maps/place/";
  let googleNaviURL = "https://www.google.com/maps/dir/";

  let results = new Object();
  results.pharmacy = new Array();
  
  
    if((near == undefined) && (most == undefined) && (area == undefined)){
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let data = getDay(date);
      let ctime = timeToString(hour, min, amorpm);
      let parseURL = 'cate=pharmacy&&cmd=searchByLatLonDistSpecificTime&&lat='+ lat + '&&lon=' + lon +'&&dist=5' + '&&time=' + ctime + '&&dayOfWeek=' + data + '&&cnt=20';
      let response = http.getUrl(url + parseURL, options);

      for(let i in response){
        let pharmacy = new Object();

        if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            pharmacy.username = self.nameInfo.nickName;
          }else{
            pharmacy.username = self.nameInfo.structuredName;
          }  
        }else{
          pharmacy.username = '사용자';
        }

        let point = new Object();
        pharmacy.point = new Object();

        let mypoint = new Object();
        pharmacy.mypoint = new Object();

        let latitude = response[i].lat;
        let longitude = response[i].lon;

        pharmacy.pharmacyname = response[i].name;
        pharmacy.address = response[i].address;
        pharmacy.tel = response[i].tel;
        if(response[i].dist != undefined)
            pharmacy.dist = Math.round(response[i].dist.toFixed(3) * 1000);
        else pharmacy.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
        pharmacy.url = googleMapURL + latitude + "," + longitude;
        pharmacy.flag = 11;
        pharmacy.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

        point.latitude = latitude;
        point.longitude = longitude;
        pharmacy.point.point = point;

        mypoint.latitude = lat;
        mypoint.longitude = lon;
        pharmacy.mypoint.point = mypoint;

        pharmacy.pharmacycount = response.length;

        pharmacy.dayofweek = data;
        pharmacy.monopentime = insert(response[i].monO, 2, ':');
        pharmacy.monclosetime = insert(response[i].monC, 2, ':');
        pharmacy.tueopentime = insert(response[i].tueO, 2, ':');
        pharmacy.tueclosetime = insert(response[i].tueC, 2, ':');
        pharmacy.wedopentime = insert(response[i].wedO, 2, ':');
        pharmacy.wedclosetime = insert(response[i].wedC, 2, ':');
        pharmacy.thuopentime = insert(response[i].thuO, 2, ':');
        pharmacy.thuclosetime = insert(response[i].thuC, 2, ':');
        pharmacy.friopentime = insert(response[i].friO, 2, ':');
        pharmacy.friclosetime = insert(response[i].friC, 2, ':');
        pharmacy.satopentime = insert(response[i].satO, 2, ':');
        pharmacy.satclosetime = insert(response[i].satC, 2, ':');
        pharmacy.sunopentime = insert(response[i].sunO, 2, ':');
        pharmacy.sunclosetime = insert(response[i].sunC, 2, ':');
      
        results.pharmacy.push(pharmacy);
      }
    }
 
  return results;
}
//************************************************************* */


/*
*  병원 정보
*/

// 1. 번 기본발화 :: 주변 병원 알려줘 ~ (디폴트 5km 반경 내)
// 2. 번 기본발화 + 병원 종류 :: 주변 병원 중에 안과 알려줘 ~ (디폴트 5km 반경 내) 
//                         :: 주변 치과 알려줘 ~ (디폴트 5km 반경 내) 

//************************************************************* */

function getHospitalInfo(near, guidance, area, point, most, self, kinds, hour, min, amorpm, date, orderbygrade){
  const console = require('console');
  const config = require('config');
  const http = require('http');

  let options = {format: 'json'};
  let url = config.get('remote.url');
  let googleMapURL = "https://www.google.com/maps/place/";
  let googleNaviURL = "https://www.google.com/maps/dir/";

  let results = new Object();
  results.hospital = new Array();
  
  // 병원 종류가 없는 경우
  if(kinds == undefined){
    // 1. 번 기본발화 (주변 병원 알려줘 ~)
    if((near != undefined) && (most == undefined) && (area == undefined) && (orderbygrade == undefined)){
      console.log("병원 1번 기본발화")
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let parseURL = 'cate=hospital&&cmd=searchByLatLonDist&&lat='+ lat + '&&lon=' + lon +'&&dist=5';
      let response = http.getUrl(url + parseURL, options);

      for(let i in response){
        let hospital = new Object();

        if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            hospital.username = self.nameInfo.nickName;
          }else{
            hospital.username = self.nameInfo.structuredName;
          }  
        }else{
          hospital.username = '사용자';
        }

        let point = new Object();
        hospital.point = new Object();

        let mypoint = new Object();
        hospital.mypoint = new Object();

        let latitude = response[i].lat;
        let longitude = response[i].lon;

        hospital.hospitalname = response[i].name;
        hospital.address = response[i].address;
        hospital.tel = response[i].tel;
        hospital.emergencytel = response[i].emergencytel;
        hospital.phonenumber = response[i].tel;
        hospital.grade = response[i].grade;
        hospital.division = response[i].division;
        if(response[i].dist != undefined)
            hospital.dist = Math.round(response[i].dist.toFixed(3) * 1000);
        else hospital.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
        hospital.url = googleMapURL + latitude + "," + longitude;
        hospital.flag = 1;
        hospital.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

        point.latitude = latitude;
        point.longitude = longitude;
        hospital.point.point = point;

        mypoint.latitude = lat;
        mypoint.longitude = lon;
        hospital.mypoint.point = mypoint;

        hospital.hospitalcount = response.length;
        let infos = require('./data/GradeInfo.js');
        hospital.gradeinfo = new Object();

        hospital.gradeinfo.title = infos.title;
        hospital.gradeinfo.surmary = infos.surmary;
        hospital.gradeinfo.standard = infos.standard;
        hospital.gradeinfo.num1 = infos.num1;
        hospital.gradeinfo.num2 = infos.num2;
        hospital.gradeinfo.num3 = infos.num3;
        hospital.gradeinfo.ref = infos.ref;
        hospital.gradeinfo.hurl = infos.hurl;

        hospital.dayofweek = getDay('오늘');
        hospital.monopentime = insert(response[i].monO, 2, ':');
        hospital.monclosetime = insert(response[i].monC, 2, ':');
        hospital.tueopentime = insert(response[i].tueO, 2, ':');
        hospital.tueclosetime = insert(response[i].tueC, 2, ':');
        hospital.wedopentime = insert(response[i].wedO, 2, ':');
        hospital.wedclosetime = insert(response[i].wedC, 2, ':');
        hospital.thuopentime = insert(response[i].thuO, 2, ':');
        hospital.thuclosetime = insert(response[i].thuC, 2, ':');
        hospital.friopentime = insert(response[i].friO, 2, ':');
        hospital.friclosetime = insert(response[i].friC, 2, ':');
        hospital.satopentime = insert(response[i].satO, 2, ':');
        hospital.satclosetime = insert(response[i].satC, 2, ':');
        hospital.sunopentime = insert(response[i].sunO, 2, ':');
        hospital.sunclosetime = insert(response[i].sunC, 2, ':');
      
        results.hospital.push(hospital);
      }
    }else if((near != undefined) && (most != undefined) && (area == undefined) && (orderbygrade == undefined)){
      console.log("most 병원 발화")
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let parseURL = 'cate=hospital&&cmd=searchByLatLonCnt&&lat='+ lat + '&&lon=' + lon +'&&cnt=1';
      let response = http.getUrl(url + parseURL, options);

      for(let i in response){
        let hospital = new Object();

        if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            hospital.username = self.nameInfo.nickName;
          }else{
            hospital.username = self.nameInfo.structuredName;
          }  
        }else{
          hospital.username = '사용자';
        }

        let point = new Object();
        hospital.point = new Object();

        let mypoint = new Object();
        hospital.mypoint = new Object();

        let latitude = response[i].lat;
        let longitude = response[i].lon;

        hospital.hospitalname = response[i].name;
        hospital.address = response[i].address;
        hospital.tel = response[i].tel;
        hospital.emergencytel = response[i].emergencytel;
        hospital.phonenumber = response[i].tel;
        hospital.grade = response[i].grade;
        hospital.division = response[i].division;
        if(response[i].dist != undefined)
            hospital.dist = Math.round(response[i].dist.toFixed(3) * 1000);
        else hospital.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
        hospital.url = googleMapURL + latitude + "," + longitude;
        hospital.flag = 4;
        hospital.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

        point.latitude = latitude;
        point.longitude = longitude;
        hospital.point.point = point;

        mypoint.latitude = lat;
        mypoint.longitude = lon;
        hospital.mypoint.point = mypoint;

        hospital.hospitalcount = response.length;
        let infos = require('./data/GradeInfo.js');
        hospital.gradeinfo = new Object();

        hospital.gradeinfo.title = infos.title;
        hospital.gradeinfo.surmary = infos.surmary;
        hospital.gradeinfo.standard = infos.standard;
        hospital.gradeinfo.num1 = infos.num1;
        hospital.gradeinfo.num2 = infos.num2;
        hospital.gradeinfo.num3 = infos.num3;
        hospital.gradeinfo.ref = infos.ref;
        hospital.gradeinfo.hurl = infos.hurl;

        hospital.dayofweek = getDay('오늘');
        hospital.monopentime = insert(response[i].monO, 2, ':');
        hospital.monclosetime = insert(response[i].monC, 2, ':');
        hospital.tueopentime = insert(response[i].tueO, 2, ':');
        hospital.tueclosetime = insert(response[i].tueC, 2, ':');
        hospital.wedopentime = insert(response[i].wedO, 2, ':');
        hospital.wedclosetime = insert(response[i].wedC, 2, ':');
        hospital.thuopentime = insert(response[i].thuO, 2, ':');
        hospital.thuclosetime = insert(response[i].thuC, 2, ':');
        hospital.friopentime = insert(response[i].friO, 2, ':');
        hospital.friclosetime = insert(response[i].friC, 2, ':');
        hospital.satopentime = insert(response[i].satO, 2, ':');
        hospital.satclosetime = insert(response[i].satC, 2, ':');
        hospital.sunopentime = insert(response[i].sunO, 2, ':');
        hospital.sunclosetime = insert(response[i].sunC, 2, ':');
      
        results.hospital.push(hospital);
      }
    }else if((near != undefined) && (most == undefined) && (area == undefined) && (orderbygrade != undefined)){
      console.log("병원 3번 등급정보 순")
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let parseURL = 'cate=hospital&&cmd=searchByLatLonDistTimeGrade&&lat='+ lat + '&&lon=' + lon +'&&dist=5&&cnt=20';
      let response = http.getUrl(url + parseURL, options);

      for(let i in response){
        let hospital = new Object();

        if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            hospital.username = self.nameInfo.nickName;
          }else{
            hospital.username = self.nameInfo.structuredName;
          }  
        }else{
          hospital.username = '사용자';
        }

        let point = new Object();
        hospital.point = new Object();

        let mypoint = new Object();
        hospital.mypoint = new Object();

        let latitude = response[i].lat;
        let longitude = response[i].lon;

        hospital.hospitalname = response[i].name;
        hospital.address = response[i].address;
        hospital.tel = response[i].tel;
        hospital.emergencytel = response[i].emergencytel;
        hospital.phonenumber = response[i].tel;
        hospital.grade = response[i].grade;
        hospital.division = response[i].division;
        if(response[i].dist != undefined)
            hospital.dist = Math.round(response[i].dist.toFixed(3) * 1000);
        else hospital.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
        hospital.url = googleMapURL + latitude + "," + longitude;
        hospital.flag = 31;
        hospital.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

        point.latitude = latitude;
        point.longitude = longitude;
        hospital.point.point = point;

        mypoint.latitude = lat;
        mypoint.longitude = lon;
        hospital.mypoint.point = mypoint;

        hospital.hospitalcount = response.length;
        let infos = require('./data/GradeInfo.js');
        hospital.gradeinfo = new Object();

        hospital.gradeinfo.title = infos.title;
        hospital.gradeinfo.surmary = infos.surmary;
        hospital.gradeinfo.standard = infos.standard;
        hospital.gradeinfo.num1 = infos.num1;
        hospital.gradeinfo.num2 = infos.num2;
        hospital.gradeinfo.num3 = infos.num3;
        hospital.gradeinfo.ref = infos.ref;
        hospital.gradeinfo.hurl = infos.hurl;

        hospital.dayofweek = getDay('오늘');
        hospital.monopentime = insert(response[i].monO, 2, ':');
        hospital.monclosetime = insert(response[i].monC, 2, ':');
        hospital.tueopentime = insert(response[i].tueO, 2, ':');
        hospital.tueclosetime = insert(response[i].tueC, 2, ':');
        hospital.wedopentime = insert(response[i].wedO, 2, ':');
        hospital.wedclosetime = insert(response[i].wedC, 2, ':');
        hospital.thuopentime = insert(response[i].thuO, 2, ':');
        hospital.thuclosetime = insert(response[i].thuC, 2, ':');
        hospital.friopentime = insert(response[i].friO, 2, ':');
        hospital.friclosetime = insert(response[i].friC, 2, ':');
        hospital.satopentime = insert(response[i].satO, 2, ':');
        hospital.satclosetime = insert(response[i].satC, 2, ':');
        hospital.sunopentime = insert(response[i].sunO, 2, ':');
        hospital.sunclosetime = insert(response[i].sunC, 2, ':');
      
        results.hospital.push(hospital);
      }
    }
  }
  //병원 종류가 있는 경우
  else{
    if((near != undefined) && (kinds != undefined) && (most == undefined) && (area == undefined) && (orderbygrade == undefined)){
      console.log("병원종류 2번 기본발화")
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let parseURL = 'cate=hospital&&cmd=searchByLatLonDist&&lat='+ lat + '&&lon=' + lon +'&&dist=5';
      let response = http.getUrl(url + parseURL, options);
      for(let i in response){
        let hospital = new Object();
        if(response[i].name.includes(kinds)){
          if(self.nameInfo != undefined){
            if(self.nameInfo.nickName){
              hospital.username = self.nameInfo.nickName;
            }else{
              hospital.username = self.nameInfo.structuredName;
            }  
          }else{
            hospital.username = '사용자';
          }

          let point = new Object();
          hospital.point = new Object();

          let mypoint = new Object();
          hospital.mypoint = new Object();

          let latitude = response[i].lat;
          let longitude = response[i].lon;
     
          hospital.hospitalname = response[i].name;
          hospital.address = response[i].address;
          hospital.tel = response[i].tel;
          hospital.emergencytel = response[i].emergencytel;
          hospital.phonenumber = response[i].tel;
          hospital.grade = response[i].grade;
          hospital.division = response[i].division;
          hospital.kinds = kinds;
          if(response[i].dist != undefined)
            hospital.dist = Math.round(response[i].dist.toFixed(3) * 1000);
          else hospital.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
          hospital.url = googleMapURL + latitude + "," + longitude;
          hospital.flag = 2;
          hospital.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

          point.latitude = latitude;
          point.longitude = longitude;
          hospital.point.point = point;

          mypoint.latitude = lat;
          mypoint.longitude = lon;
          hospital.mypoint.point = mypoint;

          let infos = require('./data/GradeInfo.js');
          hospital.gradeinfo = new Object();

          hospital.gradeinfo.title = infos.title;
          hospital.gradeinfo.surmary = infos.surmary;
          hospital.gradeinfo.standard = infos.standard;
          hospital.gradeinfo.num1 = infos.num1;
          hospital.gradeinfo.num2 = infos.num2;
          hospital.gradeinfo.num3 = infos.num3;
          hospital.gradeinfo.ref = infos.ref;
          hospital.gradeinfo.hurl = infos.hurl;

          hospital.dayofweek = getDay('오늘');
          hospital.monopentime = insert(response[i].monO, 2, ':');
          hospital.monclosetime = insert(response[i].monC, 2, ':');
          hospital.tueopentime = insert(response[i].tueO, 2, ':');
          hospital.tueclosetime = insert(response[i].tueC, 2, ':');
          hospital.wedopentime = insert(response[i].wedO, 2, ':');
          hospital.wedclosetime = insert(response[i].wedC, 2, ':');
          hospital.thuopentime = insert(response[i].thuO, 2, ':');
          hospital.thuclosetime = insert(response[i].thuC, 2, ':');
          hospital.friopentime = insert(response[i].friO, 2, ':');
          hospital.friclosetime = insert(response[i].friC, 2, ':');
          hospital.satopentime = insert(response[i].satO, 2, ':');
          hospital.satclosetime = insert(response[i].satC, 2, ':');
          hospital.sunopentime = insert(response[i].sunO, 2, ':');
          hospital.sunclosetime = insert(response[i].sunC, 2, ':');
      
          results.hospital.push(hospital);
        }
      }
      for(let i in results.hospital) results.hospital[i].hospitalcount = results.hospital.length;
    }else if((near != undefined) && (kinds != undefined) && (most != undefined) && (area == undefined) && (orderbygrade == undefined)){
      console.log("most 병원종류 발화")
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let parseURL = 'cate=hospital&&cmd=searchByLatLonDist&&lat='+ lat + '&&lon=' + lon +'&&dist=5';
      let response = http.getUrl(url + parseURL, options);
      for(let i in response){
        let hospital = new Object();
        if(response[i].name.includes(kinds)){
          if(self.nameInfo != undefined){
            if(self.nameInfo.nickName){
              hospital.username = self.nameInfo.nickName;
            }else{
              hospital.username = self.nameInfo.structuredName;
            }  
          }else{
            hospital.username = '사용자';
          }

          let point = new Object();
          hospital.point = new Object();

          let mypoint = new Object();
          hospital.mypoint = new Object();

          let latitude = response[i].lat;
          let longitude = response[i].lon;
     
          hospital.hospitalname = response[i].name;
          hospital.address = response[i].address;
          hospital.tel = response[i].tel;
          hospital.emergencytel = response[i].emergencytel;
          hospital.phonenumber = response[i].tel;
          hospital.grade = response[i].grade;
          hospital.division = response[i].division;
          hospital.kinds = kinds;
          if(response[i].dist != undefined)
            hospital.dist = Math.round(response[i].dist.toFixed(3) * 1000);
          else hospital.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
          hospital.url = googleMapURL + latitude + "," + longitude;
          hospital.flag = 4;
          hospital.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

          point.latitude = latitude;
          point.longitude = longitude;
          hospital.point.point = point;

          mypoint.latitude = lat;
          mypoint.longitude = lon;
          hospital.mypoint.point = mypoint;

          let infos = require('./data/GradeInfo.js');
          hospital.gradeinfo = new Object();

          hospital.gradeinfo.title = infos.title;
          hospital.gradeinfo.surmary = infos.surmary;
          hospital.gradeinfo.standard = infos.standard;
          hospital.gradeinfo.num1 = infos.num1;
          hospital.gradeinfo.num2 = infos.num2;
          hospital.gradeinfo.num3 = infos.num3;
          hospital.gradeinfo.ref = infos.ref;
          hospital.gradeinfo.hurl = infos.hurl;

          hospital.dayofweek = getDay('오늘');
          hospital.monopentime = insert(response[i].monO, 2, ':');
          hospital.monclosetime = insert(response[i].monC, 2, ':');
          hospital.tueopentime = insert(response[i].tueO, 2, ':');
          hospital.tueclosetime = insert(response[i].tueC, 2, ':');
          hospital.wedopentime = insert(response[i].wedO, 2, ':');
          hospital.wedclosetime = insert(response[i].wedC, 2, ':');
          hospital.thuopentime = insert(response[i].thuO, 2, ':');
          hospital.thuclosetime = insert(response[i].thuC, 2, ':');
          hospital.friopentime = insert(response[i].friO, 2, ':');
          hospital.friclosetime = insert(response[i].friC, 2, ':');
          hospital.satopentime = insert(response[i].satO, 2, ':');
          hospital.satclosetime = insert(response[i].satC, 2, ':');
          hospital.sunopentime = insert(response[i].sunO, 2, ':');
          hospital.sunclosetime = insert(response[i].sunC, 2, ':');
      
          results.hospital.push(hospital);
        }
      }
      if(results.hospital.length != 0){
        results.hospital = results.hospital[0];
      }
    }else if((near != undefined) && (most == undefined) && (area == undefined) && (orderbygrade != undefined)){
      console.log("병원종류 3번 등급정보 순")
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let parseURL = 'cate=hospital&&cmd=searchByLatLonDistTimeGrade&&lat='+ lat + '&&lon=' + lon +'&&dist=5&&cnt=20';
      let response = http.getUrl(url + parseURL, options);
      for(let i in response){
        let hospital = new Object();
        if(response[i].name.includes(kinds)){
          if(self.nameInfo != undefined){
            if(self.nameInfo.nickName){
              hospital.username = self.nameInfo.nickName;
            }else{
              hospital.username = self.nameInfo.structuredName;
            }  
          }else{
            hospital.username = '사용자';
          }

          let point = new Object();
          hospital.point = new Object();

          let mypoint = new Object();
          hospital.mypoint = new Object();

          let latitude = response[i].lat;
          let longitude = response[i].lon;
     
          hospital.hospitalname = response[i].name;
          hospital.address = response[i].address;
          hospital.tel = response[i].tel;
          hospital.emergencytel = response[i].emergencytel;
          hospital.phonenumber = response[i].tel;
          hospital.grade = response[i].grade;
          hospital.division = response[i].division;
          hospital.kinds = kinds;
          if(response[i].dist != undefined)
            hospital.dist = Math.round(response[i].dist.toFixed(3) * 1000);
          else hospital.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
          hospital.url = googleMapURL + latitude + "," + longitude;
          hospital.flag = 31;
          hospital.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

          point.latitude = latitude;
          point.longitude = longitude;
          hospital.point.point = point;

          mypoint.latitude = lat;
          mypoint.longitude = lon;
          hospital.mypoint.point = mypoint;

          let infos = require('./data/GradeInfo.js');
          hospital.gradeinfo = new Object();

          hospital.gradeinfo.title = infos.title;
          hospital.gradeinfo.surmary = infos.surmary;
          hospital.gradeinfo.standard = infos.standard;
          hospital.gradeinfo.num1 = infos.num1;
          hospital.gradeinfo.num2 = infos.num2;
          hospital.gradeinfo.num3 = infos.num3;
          hospital.gradeinfo.ref = infos.ref;
          hospital.gradeinfo.hurl = infos.hurl;

          hospital.dayofweek = getDay('오늘');
          hospital.monopentime = insert(response[i].monO, 2, ':');
          hospital.monclosetime = insert(response[i].monC, 2, ':');
          hospital.tueopentime = insert(response[i].tueO, 2, ':');
          hospital.tueclosetime = insert(response[i].tueC, 2, ':');
          hospital.wedopentime = insert(response[i].wedO, 2, ':');
          hospital.wedclosetime = insert(response[i].wedC, 2, ':');
          hospital.thuopentime = insert(response[i].thuO, 2, ':');
          hospital.thuclosetime = insert(response[i].thuC, 2, ':');
          hospital.friopentime = insert(response[i].friO, 2, ':');
          hospital.friclosetime = insert(response[i].friC, 2, ':');
          hospital.satopentime = insert(response[i].satO, 2, ':');
          hospital.satclosetime = insert(response[i].satC, 2, ':');
          hospital.sunopentime = insert(response[i].sunO, 2, ':');
          hospital.sunclosetime = insert(response[i].sunC, 2, ':');
      
          results.hospital.push(hospital);
        }
      }
      for(let i in results.hospital) results.hospital[i].hospitalcount = results.hospital.length;
    }
  }
  return results;
}

function getHospitalInfoByDate(near, guidance, area, point, most,self, kinds, date, hour, min, amorpm){
  const console = require('console');
  const config = require('config');
  const http = require('http');

  let options = {format: 'json'};
  let url = config.get('remote.url');
  let googleMapURL = "https://www.google.com/maps/place/";
  let googleNaviURL = "https://www.google.com/maps/dir/";

  let results = new Object();
  results.hospital = new Array();
  
  // 병원 종류가 없는 경우

  if(kinds == undefined){
    if((near == undefined) && (most == undefined) && (area == undefined)){
      console.log("병원+시간 1번 기본발화")
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let data = getDay(date);
      let ctime = timeToString(hour, min, amorpm);
      let parseURL = 'cate=hospital&&cmd=searchByLatLonDistSpecificTime&&lat='+ lat + '&&lon=' + lon +'&&dist=5' + '&&time=' + ctime + '&&dayOfWeek=' + data + '&&cnt=20';
      let response = http.getUrl(url + parseURL, options);

      for(let i in response){
        let hospital = new Object();

        if(self.nameInfo != undefined){
          if(self.nameInfo.nickName){
            hospital.username = self.nameInfo.nickName;
          }else{
            hospital.username = self.nameInfo.structuredName;
          }  
        }else{
          hospital.username = '사용자';
        }

        let point = new Object();
        hospital.point = new Object();

        let mypoint = new Object();
        hospital.mypoint = new Object();

        let latitude = response[i].lat;
        let longitude = response[i].lon;

        hospital.hospitalname = response[i].name;
        hospital.address = response[i].address;
        hospital.tel = response[i].tel;
        hospital.emergencytel = response[i].emergencytel;
        hospital.phonenumber = response[i].tel;
        hospital.grade = response[i].grade;
        hospital.division = response[i].division;
        if(response[i].dist != undefined)
          hospital.dist = Math.round(response[i].dist.toFixed(3) * 1000);
        else hospital.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
        hospital.url = googleMapURL + latitude + "," + longitude;
        hospital.flag = 11;
        hospital.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

        point.latitude = latitude;
        point.longitude = longitude;
        hospital.point.point = point;

        mypoint.latitude = lat;
        mypoint.longitude = lon;
        hospital.mypoint.point = mypoint;

        hospital.hospitalcount = response.length;
        let infos = require('./data/GradeInfo.js');
        hospital.gradeinfo = new Object();

        hospital.gradeinfo.title = infos.title;
        hospital.gradeinfo.surmary = infos.surmary;
        hospital.gradeinfo.standard = infos.standard;
        hospital.gradeinfo.num1 = infos.num1;
        hospital.gradeinfo.num2 = infos.num2;
        hospital.gradeinfo.num3 = infos.num3;
        hospital.gradeinfo.ref = infos.ref;
        hospital.gradeinfo.hurl = infos.hurl;

        hospital.dayofweek = data;
        hospital.monopentime = insert(response[i].monO, 2, ':');
        hospital.monclosetime = insert(response[i].monC, 2, ':');
        hospital.tueopentime = insert(response[i].tueO, 2, ':');
        hospital.tueclosetime = insert(response[i].tueC, 2, ':');
        hospital.wedopentime = insert(response[i].wedO, 2, ':');
        hospital.wedclosetime = insert(response[i].wedC, 2, ':');
        hospital.thuopentime = insert(response[i].thuO, 2, ':');
        hospital.thuclosetime = insert(response[i].thuC, 2, ':');
        hospital.friopentime = insert(response[i].friO, 2, ':');
        hospital.friclosetime = insert(response[i].friC, 2, ':');
        hospital.satopentime = insert(response[i].satO, 2, ':');
        hospital.satclosetime = insert(response[i].satC, 2, ':');
        hospital.sunopentime = insert(response[i].sunO, 2, ':');
        hospital.sunclosetime = insert(response[i].sunC, 2, ':');
      
        results.hospital.push(hospital);
      }
    }
  }

  //병원 종류가 있는 경우

  else{
    if((near == undefined) && (kinds != undefined) && (most == undefined) && (area == undefined)){
      console.log("병원종류+시간 2번 기본발화")
      let lat = point.point.latitude;
      let lon = point.point.longitude;
      let data = getDay(date);
      let ctime = timeToString(hour, min, amorpm);
      let parseURL = 'cate=hospital&&cmd=searchByLatLonDistSpecificTime&&lat='+ lat + '&&lon=' + lon +'&&dist=5' + '&&time=' + ctime + '&&dayOfWeek=' + data + '&&cnt=20';
      let response = http.getUrl(url + parseURL, options);
      for(let i in response){
        let hospital = new Object();
        if(response[i].name.includes(kinds)){
          if(self.nameInfo != undefined){
            if(self.nameInfo.nickName){
              hospital.username = self.nameInfo.nickName;
            }else{
              hospital.username = self.nameInfo.structuredName;
            }  
          }else{
            hospital.username = '사용자';
          }

          let point = new Object();
          hospital.point = new Object();

          let mypoint = new Object();
          hospital.mypoint = new Object();

          let latitude = response[i].lat;
          let longitude = response[i].lon;
     
          hospital.hospitalname = response[i].name;
          hospital.address = response[i].address;
          hospital.tel = response[i].tel;
          hospital.emergencytel = response[i].emergencytel;
          hospital.phonenumber = response[i].tel;
          hospital.grade = response[i].grade;
          hospital.division = response[i].division;
          hospital.kinds = kinds;
          if(response[i].dist != undefined)
            hospital.dist = Math.round(response[i].dist.toFixed(3) * 1000);
          else hospital.dist = Math.round(getDistance(lat,lon,latitude,longitude).toFixed(3) * 1000);
          hospital.url = googleMapURL + latitude + "," + longitude;
          hospital.flag = 21;
          hospital.naviurl = 'daummaps://route?sp=' + lat + ',' + lon + '&ep=' + latitude + ',' + longitude +'&by=CAR';

          point.latitude = latitude;
          point.longitude = longitude;
          hospital.point.point = point;

          mypoint.latitude = lat;
          mypoint.longitude = lon;
          hospital.mypoint.point = mypoint;

          let infos = require('./data/GradeInfo.js');
          hospital.gradeinfo = new Object();

          hospital.gradeinfo.title = infos.title;
          hospital.gradeinfo.surmary = infos.surmary;
          hospital.gradeinfo.standard = infos.standard;
          hospital.gradeinfo.num1 = infos.num1;
          hospital.gradeinfo.num2 = infos.num2;
          hospital.gradeinfo.num3 = infos.num3;
          hospital.gradeinfo.ref = infos.ref;
          hospital.gradeinfo.hurl = infos.hurl;

          hospital.dayofweek = data;
          hospital.monopentime = insert(response[i].monO, 2, ':');
          hospital.monclosetime = insert(response[i].monC, 2, ':');
          hospital.tueopentime = insert(response[i].tueO, 2, ':');
          hospital.tueclosetime = insert(response[i].tueC, 2, ':');
          hospital.wedopentime = insert(response[i].wedO, 2, ':');
          hospital.wedclosetime = insert(response[i].wedC, 2, ':');
          hospital.thuopentime = insert(response[i].thuO, 2, ':');
          hospital.thuclosetime = insert(response[i].thuC, 2, ':');
          hospital.friopentime = insert(response[i].friO, 2, ':');
          hospital.friclosetime = insert(response[i].friC, 2, ':');
          hospital.satopentime = insert(response[i].satO, 2, ':');
          hospital.satclosetime = insert(response[i].satC, 2, ':');
          hospital.sunopentime = insert(response[i].sunO, 2, ':');
          hospital.sunclosetime = insert(response[i].sunC, 2, ':');
      
          results.hospital.push(hospital);
        }
      }
      for(let i in results.hospital)results.hospital[i].hospitalcount = results.hospital.length;
    }
  }
  return results;
}
//************************************************************* */

//************************************************************* */
// :: util function
function insert(str, index, value) {
  let result;
  if(str != undefined){
    result = str.substr(0, index) + value + str.substr(index);
  }else{
    result = '---';
  }
  return result;   
}

function getDistance(lat1,lon1,lat2,lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);
  const dLon = deg2rad(lon2-lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function timeToString(hour, min, amorpm){
  const console = require('console');
  var chour = hour.replace('시','');
  var cmin;
  if(min == undefined){
   cmin = '00'; 
  }else{
    cmin = min.replace('분','');
  }
  if(amorpm == 'AM'){
    if(chour < 10){
      chour = '0' + chour;
    }
  }else if(amorpm == 'PM'){
    chour = (12 + (1*chour));
    console.log(chour)
  }
  var result = chour + '' + cmin;
  return result;
}

function getDay(date){
  var data;
  let options = {format: 'json'};
  const config = require('config');
  const console = require('console');
  const http = require('http');
  
  
  if(date == '일요일'){
    data = 1;
  }else if(date == '월요일'){
    data = 2;
  }else if(date == '화요일'){
    data = 3;
  }else if(date == '수요일'){
    data = 4;
  }else if(date == '목요일'){
    data = 5;
  }else if(date == '금요일'){
    data = 6;
  }else if(date == '토요일'){
    data = 7;
  }else if(date == '오늘'){
    let response = http.getUrl(config.get('remote.url') + 'cate=aaa&&cmd=now', options);
    console.log(response);
    data = response[0].dayOfWeek;
    console.log(data); 
  }else if(date == '내일'){
    let response = http.getUrl(config.get('remote.url') + 'cate=aaa&&cmd=now', options);
    console.log(response);
    data = response[0].dayOfWeek + 1;
    console.log(data);
  }
  return data;
}
//************************************************************* */

//************************************************************* */
// :: main
module.exports.function = function getInfo(near, guidance, hour, min, servicename, area, most, point, self, kinds, amorpm, date, orderbygrade){
  
  let result;

  //************************************************************* */
  // :: 모든 발화의 종점은 여기 getInfo() 함수 
  // 1. 가장 먼저 servicename으로 구분 (대피소, 병원, 약국)
  // 2. 그다음 각 servicename들의 입력 인자와 결과는 각각 함수로 따로 구현
  // 3. view는 Results concept
  //************************************************************* */

  
  //************************************************************* */
  // :: 메인 서비스 구분 로직 
  const console = require('console'); 
  console.log(servicename);

  /* 대피소 */

  if(servicename == "shelter" ){ 
    result = getShelterInfo(near,area, most, point, self);

  /* 병원 */

  }else if(servicename == "hospital" || kinds != undefined){
    if(date != undefined &&(hour != undefined || min != undefined)){
      result = getHospitalInfoByDate(near, guidance, area, point, most,self, kinds, date, hour, min, amorpm); 
    }else if(date != undefined && hour == undefined && min == undefined && amorpm == undefined){
      hour = '10시';
      amorpm = '오전';
      result = getHospitalInfoByDate(near, guidance, area, point, most,self, kinds, date, hour, min, amorpm);
    }
    else{
      result = getHospitalInfo(near, guidance, area, point, most, self, kinds, date, hour, min, amorpm, orderbygrade);
    }

  /* 약국 */
  
  }else{
    if(date != undefined &&(hour != undefined || min != undefined)){
      result = getPharmacyInfoByDate(near, guidance, area, point, most,self, kinds, date, hour, min, amorpm); 
    }else if(date != undefined && hour == undefined && min == undefined && amorpm == undefined){
      hour = '10시';
      amorpm = '오전';
      result = getPharmacyInfoByDate(near, guidance, area, point, most,self, kinds, date, hour, min, amorpm);
    }
    else{
      result = getPharmacyInfo(near, guidance, area, point, most, self, hour, min, amorpm, date);
    }
  }
  //************************************************************* */

  //************************************************************* */
  // :: 서버 url 파싱 부분 
  // let options = {format: 'json'};
  // let response = http.getUrl(config.get('remote.url'), options);
  // let googleMapURL = "https://www.google.com/maps/place/";
  // let googleNaviURL = "https://www.google.com/maps/dir/";
  //************************************************************ */
  
  return result;
}
//************************************************************* */