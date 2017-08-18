let dog = {
  name: 'doggo',
  sayName: () => {
    console.log(this.name)
  }
}
let sayName = dog.sayName
sayName()

testProm = (chVal) => {
  return new Promise((resolve, reject) => {
    const value = Math.random() * 1000;
    console.log(value);
    window.setTimeout(
      function () {
        if (value < 500) {
          resolve({type: "resolve", value: value});

        } else {
          reject({type: "reject", value: value});
        }
      }, value);
  })
    .then(function (res) {
      console.log(res);
      res.type += "_vtoroi_res";
      return res;
    })
    .then(function (res2) {

      console.log(res2);
      if (res2.value < 300) {
        throw "dfdf"
      }
    })
    .catch(function (er) {
      console.log(er);
    });
};