const { Client } = require('pg');
var connectionString = "<connection-string>";

const client = new Client({
    connectionString: connectionString
});

client.connect();

exports.mainPage = function (req, res) {
    res.render('token/mainPage', { title: 'NodeJs & PostgreSQL Crud' });
};
exports.add = function (req, res) {
    res.render('token/add', { title: "Add Customer"  });
};
exports.cancel = function(req,res){
    res.render('token/cancel',{title: "cancel token"});
}
exports.change = function(req,res){
    res.render('token/change',{title: "change token"});
}

exports.changeToken = function(req,res){
    client.query('SELECT COUNT(*) FROM tokentest WHERE session=$1 AND patientphone=$2 AND dateCol=$3',token_details,function(err,result){
        if(result.rows[0]['count']>0){
            client.query("UPDATE tokentest SET session=$1 WHERE patientphone=$2 AND dateCol=$3",token_details,function(err,result){
                if (err) {
                    console.log("Error Saving : %s ", err);
                }
                res.render('token/change',{title:"Token Removed"});
            })
        }
    })    
}

exports.cancelToken = function(req,res){
    var token_details=[req.body.phoneNo,req.body.dateCol,req.body.token]
    client.query('SELECT COUNT(*) FROM tokentest WHERE patientphone=$1 AND dateCol=$2 AND session=$3',token_details,function(err,result){
        if(result.rows[0]['count']>0){
            client.query("DELETE FROM tokentest WHERE patientphone=$1 AND dateCol=$2 AND session=$3",token_details,function(err,result){
                if (err) {
                    console.log("Error Saving : %s ", err);
                }
                res.render('token/token_cancel',{title:"Token Removed"});
            })
        }
        else{
            console.log('in else');
            res.render('token/token_cancel_err',{title:"Token doesnot exist"})
        }
    })
    
    console.log(req.body.phoneNo,req.body.dateCol,req.body.token);
}
exports.addToken = function (req, res) {
    //console.log('====????',req.body)
    
    if(req.body.token=="morning"){
        var cols = [req.body.patientname, req.body.patientphone,req.body.token,req.body.dateCol,req.body.mrng];
        client.query("SELECT COUNT(*) FROM tokentest WHERE dateCol=$1 AND session='morning'",[req.body.dateCol],function(err,result){
            if (err) {
                console.log("Error Saving : %s ", err);
            }
    
            console.log("----",result.rows)
            if(result.rows[0]['count']<50){
                client.query("SELECT tokenno from tokentest WHERE dateCol=$1 AND session='morning'",[req.body.dateCol],function(err,result){
                    console.log("tokenNo---",result.rows,typeof(result.rows))
                    const newArray= (result.rows).map(element => element.tokenno);
                    console.log("==",newArray); // [100, 200, 300]
                    var tokenNo;
                      var timings={
                          10:"9:45 A.M.-10:30 A.M.",
                          20:"10:30 A.M.-11:15 A.M.",
                          30:"11:15 A.M.-12 P.M.",
                          40:"12 P.M.-12:45 P.M.",
                          50:"12:45 P.M. -1:30 P.M."
                      }
                    for(let key in timings){
                        if(req.body.mrng==timings[key]){
                            for(var i=key-9;i<=key ;i++){
                                console.log("newArray.includes(i)",!newArray.includes(i),i);
                                if(!newArray.includes(i)){
                                    //console.log("arr--===",i,!newArray.includes(i));
                                    tokenNo = [i];
                                    //console.log("tokenNo===",tokenNo);
                                    break;
                                }
                            }
                        }
                    }
                var cols = [req.body.patientname, req.body.patientphone,req.body.token,req.body.dateCol,req.body.mrng];
                console.log("tokenNo",tokenNo,typeof(tokenNo),"newArray",newArray);
                tokenNo = tokenNo.concat(cols)
                console.log("arr--->>",tokenNo)
                client.query('INSERT INTO tokentest(tokenno,patientname,patientphone,session,dateCol,time_token) VALUES($1, $2,$3,$4,$5,$6)',tokenNo,function(err,result){
                    if(err){
                        console.log("Error Saving : %s ", err);
                    }
                    // console.log(result.rows)
                    })
                    client.query("SELECT tokenno,patientname,patientphone,session,dateCol,time_token FROM tokentest WHERE patientphone=$1 ",[cols[1]],function(err,result){
                        if(err) throw err;
                        console.log('---',result.rows);
                        res.render('token/token',{title:"token",data:result.rows})
                    });    
    
                })  
                }
            else{
                client.query("SELECT * FROM tokentest",function(err,result){
                    res.render('token/tokens_over',{title:"token"})
                })
            }
        })
    }
    
////================
if(req.body.token=="evening"){
    var cols = [req.body.patientname, req.body.patientphone,req.body.token,req.body.dateCol,req.body.eve];
    client.query("SELECT COUNT(*) FROM tokentest WHERE dateCol=$1 AND session='evening'",[req.body.dateCol],function(err,result){
        if (err) {
            console.log("Error Saving : %s ", err);
        }

        console.log("----",result.rows)
        if(result.rows[0]['count']<50){
            client.query("SELECT tokenno from tokentest WHERE dateCol=$1 AND session='evening'",[req.body.dateCol],function(err,result){
                console.log("tokenNo---",result.rows,typeof(result.rows))
                const newArray= (result.rows).map(element => element.tokenno);
                console.log("==",newArray); // [100, 200, 300]
                var tokenNo;
                  var timings={
                      10:"5:45 P.M. -6:30 P.M.",
                      20:"6:30 P.M.-7:15 P.M.",
                      30:"7:15 P.M. -8 P.M.",
                      40:"8 P.M.-8:45 P.M.",
                      50:"8:45 P.M.-9:30 P.M."
                  }
                for(let key in timings){
                    if(req.body.eve==timings[key]){
                        for(var i=key-9;i<=key ;i++){
                            console.log("newArray.includes(i)",!newArray.includes(i),i);
                            if(!newArray.includes(i)){
                                tokenNo = [i];
                                break;
                            }
                        }
                    }
                }
            var cols = [req.body.patientname, req.body.patientphone,req.body.token,req.body.dateCol,req.body.eve];
            console.log("tokenNo",tokenNo,typeof(tokenNo),"newArray",newArray);
            tokenNo = tokenNo.concat(cols)
            console.log("arr--->>",tokenNo)
            client.query('INSERT INTO tokentest(tokenno,patientname,patientphone,session,dateCol,time_token) VALUES($1, $2,$3,$4,$5,$6)',tokenNo,function(err,result){
                if(err){
                    console.log("Error Saving : %s ", err);
                }
                })
                client.query("SELECT tokenno,patientname,patientphone,session,dateCol,time_token FROM tokentest WHERE patientphone=$1 ",[cols[1]],function(err,result){
                    if(err) throw err;
                    console.log('---',result.rows);
                    res.render('token/token',{title:"token",data:result.rows})
                });    

            })  
        }
        else{
            client.query("SELECT * FROM tokentest",function(err,result){
                res.render('token/tokens_over',{title:"token"})
            })
        }
    })
}
};


