module.exports.function = function actionSelectPharmacy (results, order) {
  let pharmacy;
  if(order == "first"){
    pharmacy = results.pharmacy[0];
  }else if(order=="second"){
    pharmacy = results.pharmacy[1];
  }
  return pharmacy;
}
