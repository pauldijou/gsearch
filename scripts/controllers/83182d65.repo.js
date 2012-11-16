'use strict';

gsearchApp.controller('RepoCtrl', function($scope, $routeParams, $filter, repo) {
    $scope.owner = $routeParams.owner;
    $scope.name = $routeParams.name;
    $scope.committers = [];
    $scope.timeline = [];

    // Request repo info from GitHub
    $scope.repo = repo.get({
        // Request params
        owner : $scope.owner,
        name : $scope.name
    });
    
    // Request commits from GitHub
    $scope.commits = repo.commits({
        // Request params
        owner : $scope.owner,
        name : $scope.name
    }, function() {
        // Success
        // Increment committers based on commits
        _.each($scope.commits, function(commit) {
            if (commit.author) {
                var authors = _.where($scope.committers, {login: commit.author.login});
                var author;
                if(authors.length == 0) {
                    author = commit.author;
                    author.numberOfCommits = 0;
                    $scope.committers.push(author);
                } else {
                    author = authors.pop();
                }
                
                author.numberOfCommits++;
            }
        });
        
        // Sort committers by numberOfCommits DESC
        $scope.committers = _.sortBy($scope.committers, function(committer) {
            return 1/committer.numberOfCommits;
        });
        
        // Generate charts
        $scope.updateCommitsPieChart();
        $scope.updateCommitsColumnChart();
        $scope.updateCommitsAreaStackChart();
        
        // Generate timeline
        $scope.fillTimeline();
    });
    
    $scope.fillTimeline = function() {
        var timeline = [];
        
        _.each($scope.commits, function(globalCommit) {
            var commit = globalCommit.commit;
            var dateCommit = new Date(commit.author.date);
            
            var event = {};
            event.date = $filter('date')(dateCommit, 'yyyy-MM-dd hh:mm:ss');
            
            // Init key and title for month and week
            var monthKey = $filter('date')(dateCommit, 'yyyy-MM');
            var monthTitle = $filter('date')(dateCommit, 'MMM yyyy');
            dateCommit.toFirstDayWeek();
            var weekKey = $filter('date')(dateCommit, 'yyyy-MM-dd');
            var weekTitle = $filter('date')(dateCommit, 'EEE dd/MM') + " - ";
            dateCommit.setDate(dateCommit.getDate()+6);
            weekTitle += $filter('date')(dateCommit, 'EEE dd/MM')
            
            // Get month if exists or init it
            var month = _.where(timeline, {key: monthKey});
            
            if(month.length == 0) {
                month = {key: monthKey, title: monthTitle, weeks: []};
                timeline.push(month);
            } else {
                month = month.pop();
            }
            
            // Get week if exists or init it
            var week = _.where(month.weeks, {key: weekKey});
            
            if(week.length == 0) {
                week = {key: weekKey, title: weekTitle, events: []};
                month.weeks.push(week);
            } else {
                week = week.pop();
            }
            
            // Push event to week
            event.sha = globalCommit.sha;
            event.authorName = commit.author.name;
            event.authorEmail = commit.author.email;
            event.url = commit.url.replace('https://api.github.com/repos', 'https://github.com').replace('/git/commits/', '/commit/').replace('/commits/', '/commit/');
            event.message = commit.message;
            
            week.events.push(event);
        });
        
        // Sort data
        _.each(timeline, function(month) {
            month.totalCommits = 0;
            
            _.each(month.weeks, function(week) {
                week.events = _.sortBy(week.events, 'date');
                week.events.reverse();
                week.totalCommits = week.events.length;
                month.totalCommits += week.events.length;
            });
            
            month.weeks = _.sortBy(month.weeks, 'key');
            month.weeks.reverse();
        });
        
        timeline = _.sortBy(timeline, 'key');
        timeline.reverse();
        
        // Assign data to scope
        $scope.timeline = timeline;
    }

    // Function to generate the pie chart
    $scope.updateCommitsPieChart = function() {
        var commitsData = [];
        _.each($scope.committers, function(committer) {
            commitsData.push([ committer.login, committer.numberOfCommits ]);
        });
        
        var chart = new Highcharts.Chart({
            chart : {
                renderTo : 'commitsPieChart',
                plotBackgroundColor : null,
                plotBorderWidth : null,
                plotShadow : false
            },
            title : {
                text : 'Commits repartition'
            },
            tooltip : {
                pointFormat : '{series.name}: <b>{point.percentage}% ({point.y})</b>',
                percentageDecimals : 2
            },
            plotOptions : {
                pie : {
                    allowPointSelect : true,
                    cursor : 'pointer',
                    dataLabels : {
                        enabled : true,
                        color : '#000000',
                        connectorColor : '#000000',
                        formatter : function() {
                            return '<b>' + this.point.name + '</b>: ' + Highcharts.numberFormat(this.percentage, 2)  + '% (' + this.point.y + ')';
                        }
                    }
                }
            },
            series : [ {
                type : 'pie',
                name : 'Commits',
                data : commitsData
            } ]
        });
    }
    
    $scope.updateCommitsColumnChart = function() {
        var categories = [];
        var serieData = [];
        _.each($scope.committers, function(committer, index) {
            categories.push(committer.login);
            serieData.push(committer.numberOfCommits);
        });
        
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'commitsColumnChart',
                type: 'column',
                margin: [ 50, 50, 100, 80]
            },
            title: {
                text: 'Number of commits'
            },
            xAxis: {
                categories: categories,
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Commits'
                }
            },
            plotOptions: {
              column: {
                  colorByPoint: true
              }  
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.x +'</b><br/>'+
                        'Commits: '+ this.y;
                }
            },
            series: [{
                name: 'Commits',
                data: serieData,
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    x: +3,
                    y: 10,
                    formatter: function() {
                        return this.y;
                    },
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }]
        });
    }
    
    $scope.updateCommitsAreaStackChart = function() {
        var groupedByWeek = _.groupBy($scope.commits, function(commit) {
            var commitDate = new Date(Date.parse(commit.commit.author.date));
            commitDate.toFirstDayWeek();
            return Highcharts.dateFormat('%d/%m/%Y', commitDate.getTime());
        });
        
        var categories = [];
        var series = [];
        
        _.each($scope.committers, function(committer) {
            series.push({name: committer.login, data: [0]});
        });
        
        var index = 0;
        _.each(groupedByWeek, function(commits, date) {
            categories.push(date);
            _.each(commits, function(commit) {
                if(commit.author) {
                    var serie = _.where(series, {name: commit.author.login}).pop();
                    if(serie.data[index]) {
                        serie.data[index]++
                    } else if(index == 0) {
                        serie.data[index] = 1;
                    } else {
                        serie.data[index] = 1 + serie.data[index-1];
                    }
                }
            });
            
            _.each(series, function(serie) {
               if(index > 0 && !serie.data[index]) {
                   serie.data[index] = serie.data[index-1];
               } 
            });
            
            index++;
        });
        
        var chart = new Highcharts.Chart({
            chart: {
                renderTo: 'commitsAreaStackChart',
                type: 'area'
            },
            title: {
                text: 'Stacked commits per week and per author'
            },
            xAxis: {
                categories: categories,
                tickmarkPlacement: 'on',
                title: {
                    enabled: false
                }
            },
            yAxis: {
                title: {
                    text: 'Commits'
                },
                labels: {
                    formatter: function() {
                        return this.value;
                    }
                }
            },
            tooltip: {
                formatter: function() {
                    return ''+
                        this.x +', ' + this.series.name + ': '+ this.y +' commits';
                }
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    }
                }
            },
            series: series
        });
    }
});
