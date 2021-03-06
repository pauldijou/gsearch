'use strict';

gsearchApp.controller('RepoCtrl', ['$scope', '$routeParams', '$filter', 'repo', 'util', function($scope, $routeParams, $filter, repo, util) {
    $scope.owner = $routeParams.owner;
    $scope.name = $routeParams.name;
    $scope.fullName = util.getRepoFullName($scope.owner, $scope.name);
    $scope.committers = [];
    $scope.timeline = [];
    
    $scope.getFavoriteLabel = function(login) {
        if(login) {
            if(util.isFavoriteUser(login)) {
                return 'Favorite';
            } else {
                return 'Add to favorites';
            }
        }
        else {
            if(util.isFavoriteRepo($scope.fullName)) {
                return 'Favorite';
            } else {
                return 'Add to favorites';
            }
        }
    }

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
        $scope.committers = _.reduce($scope.commits, function(committers, commit) {
            if (commit.author) {
                var authors = _.where(committers, {login: commit.author.login});
                var author;
                if(authors.length == 0) {
                    author = commit.author;
                    author.numberOfCommits = 0;
                    committers.push(author);
                } else {
                    author = authors.pop();
                }
                
                author.numberOfCommits++;
            }
            return committers;
        }, []);
        
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
        var timeline = _.reduce($scope.commits, function(localTimeline, globalCommit) {
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
            var month = _.where(localTimeline, {key: monthKey});
            
            if(month.length == 0) {
                month = {key: monthKey, title: monthTitle, weeks: []};
                localTimeline.push(month);
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
            event.smallSha = globalCommit.sha.slice(0,6);
            event.authorName = commit.author.name;
            event.authorEmail = commit.author.email;
            event.url = commit.url.replace('https://api.github.com/repos', 'https://github.com').replace('/git/commits/', '/commit/').replace('/commits/', '/commit/');
            event.message = commit.message;
            
            week.events.push(event);
            
            return localTimeline;
        }, []);
        
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
        var commitsData = _.map($scope.committers, function(committer) {
            return [ committer.login, committer.numberOfCommits ]
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
        var categories = _.map($scope.committers, function(committer) {
            return committer.login
        });
        
        var serieData = _.map($scope.committers, function(committer) {
            return committer.numberOfCommits
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
        
        var categories = _.map(groupedByWeek, function(commits, date) {
            return date;
        });
        
        var series = _.map($scope.committers, function(committer) {
            return {name: committer.login, data: [0]}
        });
        
        var index = 0;
        _.each(groupedByWeek, function(commits, date) {
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
                },
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
}]);
