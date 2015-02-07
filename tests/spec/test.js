//console.log(assert)
//    var assert = chai.assert;
    var expect = chai.expect;
//    var should = chai.should();
console.log(expect)
//console.log(should)

describe('Dater faker should return correct data length', function(){
    it("data0 should have an array length of 12", function(){
       // expect(12).to.be(12)
    })

    it('should take less than 500ms', function(done){
        this.timeout(500);
        setTimeout(done, 300);
    })

    it("data1 should have an array length of 18", function(){
        expect(12).to.be(18)
    })
})