self.sessions={};var initiatorTag="initiator",receiverTag="receiver",sessionIdTag="sessionId",storedMessagesTag="storedMessages";
self.addEventListener("connect",function(e){var c=e.ports[0];c.onmessage=function(a){var b=a.data;if(sessionIdTag in b){var d=b.sessionId;d in self.sessions||(self.sessions[d]={id:d});a=sessions[d];if(initiatorTag in a&&a[initiatorTag].userId==b.userId)receiverTag in a?a[receiverTag].port.postMessage(b):a[initiatorTag][storedMessagesTag].push(b);else if(receiverTag in a&&a[receiverTag].userId==b.userId)initiatorTag in a?a[initiatorTag].port.postMessage(b):a[receiverTag][storedMessages].push(b);else if(initiatorTag in
a)if(receiverTag in a)c.postMessage({error:"too many people in this session"}),c.close();else{if(a[receiverTag]={userId:b.userId,port:c,storedMessage:[]},sessions[d]=a,c.postMessage({connect:d,isCaller:!1}),initiatorTag in a&&storedMessagesTag in a.initiator)for(b=a[initiatorTag][storedMessagesTag].shift();void 0!=b;)c.postMessage(b),b=a[initiatorTag][storedMessagesTag].shift()}else if(a[initiatorTag]={userId:b.userId,port:c,storedMessages:[]},sessions[d]=a,c.postMessage({connect:d,isCaller:!0}),
receiverTag in a&&storedMessagesTag in a.receiver)for(b=a[receiverTag][storedMessagesTag].shift();void 0!=b;)c.postMessage(b),b=a[receiverTag][storedMessagesTag].shift()}}},!1);