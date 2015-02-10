AppMain.directive('calandar', function(reactDirective) {
    return reactDirective(Calendar);
});

AppMain.directive('calandar-cell', function(reactDirective) {
    return reactDirective(CalendarCell);
});


