This is v2.0 of my (Hunter Hartline) Restroom Occupancy Monitor.

Improvements already acclompished:

    - Major code cleanup (delete ALL unused code, refactored for significantly cleaner sections of code)
    - Added very necessary Node debounce function to use with magnetic door switch .on listener calling potentially pesky timer
    - Updated styling a bit (Tollens Pauper is gone, not sure where he/she went - another character is in their place, Rolo Tony)
    - Also, when backend is not detected, loading cylon page has been updated --> machineslate gray bg with fixed spa view -- cleaner
    - renamed quite a few variables to use some of that sweet insight gained from Uncle Bob Martin's Clean Code

A handy IoT device that monitors the status of a restroom door ("closed"/"open"), along with the duration of its being closed, and displays the data. The graphic user interface is aesthetically pleasing, and includes an interactive line graph and table that updates, real-time, newly recorded bathroom sessions. Built with React, Node, Johnny-Five, Sockets.io, and Firebase real-time database. 
