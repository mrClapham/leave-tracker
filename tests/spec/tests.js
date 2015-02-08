describe("A suite", function() {
    it("contains spec with an expectation", function() {
        expect(true).toBe(true);
    });
    it("contains spec with an expectation", function() {
        expect(false).toBe(false);
    });
});


describe("The AppMAin should be able to be instantiated.", function(){

    var $scope;
    var controller;

    beforeEach(function(){
        module('AppMain');
        inject(function(_$rootScope_, $controller) {

            $scope = _$rootScope_.$new();
            controller = $controller("AppController", {$scope: $scope});
        });
    });


    it("Should instatiate", function(){
        expect(AppMain).not.toBe(null);
    })




})