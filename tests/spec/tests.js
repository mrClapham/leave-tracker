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
    var appControllerModel;

    beforeEach(function(){
        module('AppMain');
        inject(function(_$rootScope_, $controller, $injector) {
            $scope = _$rootScope_.$new();
            appControllerModel = $injector.get('AppControllerModel')
            controller = $controller("AppController", {$scope: $scope, appControllerModel:appControllerModel});

        });


    });


    it("Should instatiate", function(){
        expect(AppMain).not.toBe(null);
    })

    it("Should have a controller called 'AppController'", function(){
        expect(controller).not.toBe(null);
    })

    it("Should have a factory called 'AppControllerModel'", function(){
        expect(appControllerModel).not.toBe(null);
    })

    it("controller.testData should be 'AppController data'", function(){
        expect(controller.testData).toBe("AppController data");
    })



})