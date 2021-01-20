This is v2.0 of my (Hunter Hartline) Restroom Occupancy Monitor.

Improvements already acclompished:

    - Major code cleanup (delete ALL unused code, better arrange, refactors for significantly cleaner sections of code)
    - Added very necessary Node debounce function to use with magnetic door switch .on listener calling potentially pesky timer
    - Updated styling a bit (Tollens Pauper is gone, not sure where he/she went - another character is in their place, Rolo Tony)
    - Also, when backend is not detected, loading cylon page has been updated --> machineslate gray bg with fixed spa view -- cleaner
    - renamed quite a few variables to use some of that sweet insight gained from Uncle Bob Martin's Clean Code

TODO: 
    ** There are still quite a few things to do. Mostly research and completely knocking out the weird leak/rendering issue that occurs only occassionally now.

    - Implement Redis for data persistence in the backend
    - Firebase Firestore is the current data store (cloud) for data:
        - This will need to be updated to hold an additional field (UID), I believe, and be used more for long-term holding of data.
        - Redis will be the more active/short-term/busy part of data transferring and persisting

    - Implement a way to manage all of the unique socket connections:
        - This is very important. There's no need for security per se, but each invidual connection should be accounted for and managed in terms of making
            sure the right things are tracked, and the experience for individual users is consistent/correct.
        - It's very important to note there are absolutely zero data collected by this app from the user. The idea of managing the connections is exactly
            and only that: when a device connects (no info about the other end, other then the frontend url was visited by anonymous person), socket.io assigns
            clientID for that socket, so the only thing managed or known is the created socket client id for keeping track of updating data to necessary devices
    
    - You know what you need to do: permanently fix the shit out of the weird unnecessary/repeat renderings and memory leak
    - Implement this project with different database types on the cloud (e.g. MSSQL on Azure, CosmosDB, AWS, etc. -- MongoDB)

    - Eventually there will be a Golang version of this!

    - Oh yeah, successfully Dockerize this thing

    - And, update Timer styling on main App page

    - Much more





A handy IoT device that monitors the status of a restroom door ("closed"/"open"), along with the duration of its being closed, and displays the data. The graphic user interface is aesthetically pleasing, and includes an interactive line graph and table that updates, real-time, newly recorded bathroom sessions. Built with React, Node, Johnny-Five, Sockets.io, and Firebase real-time database. 
