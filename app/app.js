(function(){
   var app = angular.module('chat', []);

    app.controller('mainCtrl', function($scope, $location, $anchorScroll, $timeout, $interval, $http){
        $scope.messages = [];

        getMessages(-1);
        $interval(getNewMessages, 1000);

        $scope.sendMessage = function(){

            var message = {
                content: $scope.message
            }

            $http.post('/api/chat', message).success(function(message){
                if(message){
                    message.system = true;
                    $scope.messages.push(message);
                    scrollToBottom();
                }
            });

            $scope.message = '';
        };

        function scrollToBottom(){
            $timeout(function(){
                $location.hash('chat-bottom');
                $anchorScroll();
            }, 100);
        }

        function getMessages(lastMessageId){

            var config = { params:{
                lastMessageId: lastMessageId
            }};

            $http.get('/api/chat', config).success(function(messages){
                var i;
                for(i = 0; i < messages.length; i+=1){
                    $scope.messages.push(messages[i]);
                    scrollToBottom();
                }

            });
        }

        function getNewMessages(){

            var lastMessageId =  -1;
            var lastMessage = _.last($scope.messages);
            if(lastMessage) {
                lastMessageId = lastMessage.Id;
            }
            getMessages(lastMessageId);
        }
    })
}());