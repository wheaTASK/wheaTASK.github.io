var dormJSON;


$( document ).ready(function() {
// function chapinVals() {
    //get data and put into array
    
        var rawVals=[];


        $.ajax({
        url: "test.xml", //Replace with path to xml file once on the cs server.  For now just use a local file (note this won't work in chrome) 
        dataType: 'xml',
        async: true,
        success: function(data){

            var xml = $('group',data);
            xml.find("c").each(function() {

                rawVals.push(1*($(this).text()));
        
            });


            var firstVal= findEnd(rawVals);
            var usageVals =[];

            getUsage(rawVals,firstVal,usageVals);
            toKWH(usageVals);


            dormJSON = JSON.parse(JSON.stringify(dormData));
            console.log(dormJSON);
            // console.log(dormJSON.features[2].properties.power);

            // set dormData values to kw/h
            // 17 is number of dorms
            for (var i = 0; i < 17; i++) {
                if (dormJSON.features[i].properties.name == "Chapin") {
                    dormJSON.features[i].properties.power = usageVals[0];
                    // console.log("Chapin is i " + i);
                }
            }
            console.log(dormJSON.features[2].properties.power);

            // for when we're pulling data from all gauges not using just
            // Chapin
            //
            // for (var i = 0; i < 17; i++)
            // {
            //     if (dormJSON.features[i].properties.name == "Chapin") {
            //         dormJSON.features[i].properties.power = usageVals[0];
            // }



            // dormData[2].power = usageVals[0];
            // console.log(dormData[2].power);
            // console.log(usageVals[0]);
        },
        error: function(data){
            console.log("Didn't work");
        }
        });
// }
});
    
function findEnd(vals){

    //Necessary for now because the first ~60 values are bad at time of writing this
    //Shouldn't matter if data is already right this won't affect it

    var i=(vals.length)-1;
    while(vals[i]==vals[i-1] || vals[i-1]==vals[i-2]){
        i--;
    }
    return i;
}

function getUsage(raw, end, usage){

    // find usage per (day/month/hour/etc)
    for (var i = 0; i < end; i++) {
        
        usage.push(raw[i]-raw[i+1]);
        
    }
    
}

function toKWH(ws){
    // convert to kw/h
    for (var i =0; i< ws.length ; i++) {
        ws[i]= ws[i] / 3600000;
    }
}