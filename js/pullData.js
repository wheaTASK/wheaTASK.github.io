var valStructure= '{"beard" : [],"emerson-dorm" : [],"chapin" : [],"clark" : [],"mcintire" : [],"young" : [],"meadows-east" : [], "meadows-west" : [], "meadows-north" : [],"metcalf" : [],"kilham" : [],"larcom" : [], "stanton": [], "cragin" : [],"everett" : [], "gebbie": [], "keefe": []}';

var xmlNames= ["beard", "emerson-dorm", "chapin", "meadows-ew-1st-floor", "meadows-north-1st-floor", "stanton-cragin-everett", "clark-mcintire-young", "metcalf", "kilham", "larcom", "everett-heights", "gebbie-keefe", "meadows-ew-2nd-floor", "meadows-ew-3rd-floor", "meadows-ew-4th-floor", "meadows-north-2nd-floor", "meadows-north-3rd-floor", "meadows-north-4th-floor"];

var ewMeadowsDorms=["meadows-ew-2nd-floor", "meadows-ew-3rd-floor"];
var nMeadowsDorms=["meadows-north-2nd-floor", "meadows-north-3rd-floor", "meadows-north-4th-floor"];

var allVals=JSON.parse(valStructure);
var userVals=JSON.parse(valStructure);

var numHours=1509;

var avgKWh=JSON.parse(valStructure);

$( document ).ready(function() {
    
        for (var i = 0; i < xmlNames.length; i++) {
            
            var name= xmlNames[i];
            var extension= ".xml"; 
            var egaugeURL= "http://cs.wheatoncollege.edu/~egauge/"
            var slash="/";
            var tempPath= egaugeURL.concat(name,slash,name,extension);

            storeVals(tempPath,name);
           
            
        }

        setTimeout(echoData,1000);
        setTimeout(toKWH,2000);
        var startDate = new Date(2016, 03, 03);
        var endDate = new Date(2016, 04, 03);
        setTimeout(function() {
            getValRange("hour",startDate,endDate)
        },2000);
        //Important: all data processing must wait 1 second for data to be read in. If more than 1 function needed make a function that calls the all necessary functions and call it here in place to toKWH
        
        setTimeout(avgKWH,2000);

});

function storeVals(path,dorm){

     var temp=[];

        //get data and put into array
        $.ajax({
        url: path, 
        dataType: 'xml',
        async: true,
        success: function(data){

            var xml = $('group',data);
            xml.find("c").each(function() {
               temp.push(1*($(this).text())); 
            });
            
            //Things that get summed: dorm and computer panel, panel 1 and panel 2
            //Dorms with things to sum: emerson, larcom, meadows ew 1st floor, meadows north 1st floor, stanton
            //Dorms to separate: ymc, cragin-everett-stanton, gebbie-keefe  
            //Kilham: Sum column 0,1,2,4,6,8 in each row skip rest
            //Meadows-ew-4th: sum column 0 and 1 in each row skip rest

            if (dorm == "clark-mcintire-young"){
                for (var i = 0; i <= (numHours *3) +2; i++) {
                    if (i%3==0){
                        allVals["clark"].push(temp[i]);
                    }
                    else if (i%3==1){
                        allVals["mcintire"].push(temp[i]);
                    }
                    else {
                        allVals["young"].push(temp[i]);
                    }
                }
            }

            else if (dorm == "stanton-cragin-everett"){
                var counter=0;
                for (var i = 0; i <= (numHours*4)+2; i++) {
                    if (i%4==0){
                        allVals["stanton"].push(temp[i]);
                    }
                    else if (i%4==1){
                        allVals["stanton"][counter]+=temp[i];
                        counter++;
                    }
                    else if (i%4==2){
                        allVals["cragin"].push(temp[i]);
                    }
                    else {
                        allVals["everett"].push(temp[i]);
                    }
                }
            }

            else if (dorm == "meadows-ew-1st-floor"){
                for (var i = 0; i <= (numHours*4); i+=4) {
                   allVals["meadows-east"].push(temp[i]+temp[i+3]);
                   allVals["meadows-west"].push(temp[i+1]+temp[i+2]);
                }
            }

            else if(ewMeadowsDorms.indexOf(dorm) > -1){ 
                var counter=0;
                for (var i = 0; i <= (numHours*2); i+=2) {
                   allVals["meadows-east"][counter]+=(temp[i]);
                   allVals["meadows-west"][counter]+=(temp[i+1]);
                   counter++;
                }

            }

            else if(dorm == "meadows-ew-4th-floor"){ 
                var counter=0;
                for (var i = 0; i <= (numHours*14); i+=14) {
                   allVals["meadows-east"][counter]+=(temp[i]);
                   allVals["meadows-west"][counter]+=(temp[i+1]);
                   counter++;
                }

            }
            
            else if (dorm == "meadows-north-1st-floor"){
                for (var i = 0; i <= (numHours*2); i+=2) {
                   allVals["meadows-north"].push(temp[i]+temp[i+1]);
                }
            }

            else if (dorm == "emerson-dorm"){
                for (var i = 0; i <= (numHours*2); i+=2) {
                   allVals["emerson-dorm"].push(temp[i]+temp[i+1]);
                }
            }

            else if (dorm == "larcom"){
                for (var i = 0; i <= (numHours*2); i+=2) {
                   allVals["larcom"].push(temp[i]+temp[i+1]);
                }
            }

            else if (dorm == "kilham"){

                for (var i = 0; i <= (numHours*10); i+=10) {
                   allVals["kilham"].push(temp[i]+temp[i+1]+temp[i+2]+temp[i+4]+temp[i+6]+temp[i+8]);
                }                    


            }

            else if (dorm == "gebbie-keefe"){
                
                for (var i = 0; i <= (numHours*2)+1; i++) {
                    if (i%2==0){
                        allVals["gebbie"].push(-1*temp[i]);
                    }
                    else {
                        allVals["keefe"].push(-1*temp[i]);
                    }
                }

            }

        
            
            else if(nMeadowsDorms.indexOf(dorm) > -1){

                for (var i = 0; i <= numHours; i++) {
                       allVals["meadows-north"][i]+=temp[i];
                }

            }

            else if (dorm == "everett-heights"){
                for (var i = 0; i <= numHours; i++) {
        
                    allVals["everett"][i]+=temp[i];

                }
            }
            
            else{ 
                for (var i = 0; i <= numHours; i++) {
        
                    allVals[dorm].push(temp[i]);

                }
            }       
        },
        error: function(data){
            console.log("Didn't work");
        }
        });

}

function getValRange(delim,start,end){

    //For start and end use date.getTime()    
    

    var firstVal = 1462306500; //Time of most recent data value
    var lastVal = firstVal- (3600*numHours); //Currently have 2999 rows of data which is 998 hours of data. 3600s in an hr

    var temp=[];
    var posStart, posEnd;
    
    //Find how many hours after the first data value we have the user start date is.  That is the first postion in array to read from
    posStart=parseInt((start.getTime()/1000-lastVal)/3600);
    //Find how many hours before the last data value we have the user end date is.  1000-posEnd is the last position in array to read
    posEnd= parseInt((firstVal-end.getTime()/1000)/3600);

    if (delim=='hour'){
        for (var i = 0; i < _.size(userVals); i++) {
            var name= _.keys(userVals)[i];

            for (var j = posStart; j <= numHours-posEnd; j++) {
                    userVals[name].push(allVals[name][j]);

            }

        }       
        // console.log(userVals);
    }

    else if (delim=='day'){

        for (var i = 0; i < _.size(userVals); i++) {
            
            var counter=0;
            var name= _.keys(userVals)[i];

            for (var j = posStart; j < numHours-posEnd; j++) {
                //24 hrs in a day so we want every 24th value
                if(counter%24==0){
                    userVals[name].push(allVals[name][j]);
                }

                counter++;
                
            }

        }

    }

    else if (delim=='week'){

        for (var i = 0; i < _.size(userVals); i++) {
            
            var counter=0;
            var name= _.keys(userVals)[i];

            for (var j = posStart; j < numHours-posEnd; j++) {
                //168 hours in a week so we want every 168 value
                if(counter%168==0){
                    userVals[name].push(allVals[name][j]);
                }

                counter++;
                
            }

        }

    }

}

function toKWH(){
    for (var i = 0; i <_.size(allVals); i++) {
        var last=allVals[_.keys(allVals)[i]].length -1;
        for (var j = 0; j < last; j++) {
            allVals[_.keys(allVals)[i]][j]=((allVals[_.keys(allVals)[i]][j]-allVals[_.keys(allVals)[i]][j+1])/3600000)
            
        }
        //Remove last value as it is not a kwh usage val
        allVals[_.keys(allVals)[i]].splice(last,1);
    }

    console.log(allVals);
    avgKWH();
}

function avgKWH() {
    // var startMonth = startDate.getMonth()+1;
    // var startDay = startDate.getDate();
    // var endMonth = endDate.getMonth()+1;
    // var endDay = endDate.getDate();
    // var hoursBack = 0;

    // // get hours between two picked dates
    // var timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    // var hourDiff = Math.ceil(timeDiff / (1000 * 3600));
    // console.log(hourDiff);
    
    // // get hours from last data entry
    // var lastDate = new Date(2016, 04, 02);
    // var dayDiff = Math.abs(lastDate.getTime() - startDate.getTime());
    // hoursBack = Math.ceil(dayDiff / (1000 * 3600));

    // console.log(userVals);


    for (var i = 0; i < _.size(userVals); i++) {
        var last = userVals[_.keys(userVals)[i]].length -1;
        var sum = 0;
        for (var j = 0; j < last; j++) {
            sum += userVals[_.keys(userVals)[i]][j];
        }
        avgKWh[_.keys(avgKWh)[i]][0] = sum/last;
        // console.log(i + ": " + avgKWh[_.keys(avgKWh)[i]][0]);
    }

    resetEachDorm();
}

function resetEachDorm() {
    for (var i = 0; i < Object.keys(dormData["features"]).length; i++) {
        // console.log(dormData["features"][i].properties.name);
        var dormName = dormData["features"][i].properties.name;
        

            var j = _.indexOf(_.keys(avgKWh), dormData["features"][i].properties.name);
            // console.log(avgKWh[_.keys(avgKWh)[j]]);
            dormData["features"][i].properties.power = avgKWh[_.keys(avgKWh)[j]][0].toFixed(2);
            dormData["features"][i].properties.cost = (dormData["features"][i].properties.power*.14).toFixed(2);
    }
}

function echoData(){

    console.log(allVals);

}