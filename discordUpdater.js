const discordStatusDiv = document.getElementById('discord-status');
const discordGlobalNameDiv = document.querySelector('.discord-name-global');
const discordUserNameDiv = document.querySelector('.discord-name-user');
const discordPfpImg = document.querySelector('.discord-pfp');
const statusCircle = discordStatusDiv.querySelector('.status-circle');
const statusText = discordStatusDiv.querySelector('.status-text');
const activitiesContainer = document.querySelector('.activities-container');

function fetchDiscordStatus() {
    fetch('https://api.lanyard.rest/v1/users/799382775333126155')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const user = data.data;
                let statusClass = 'offline';
                let statusTextValue = 'Offline';
                let circleColor = '#999999';
                if (user.listening_to_spotify) {
                    statusClass = 'online';
                    statusTextValue = 'Listening to Spotify';
                    circleColor = '#66FF99';
                }
                else {
                    switch (user.discord_status) {
                        case 'online':
                            statusClass = 'online';
                            statusTextValue = 'Online';
                            circleColor = '#66FF99';
                            break;
                        case 'idle':
                            statusClass = 'idle';
                            statusTextValue = 'Idle';
                            circleColor = '#FFCC00';
                            break;
                        case 'dnd':
                            statusClass = 'dnd';
                            statusTextValue = 'Do Not Disturb';
                            circleColor = '#FF6666';
                            break;
                        case 'offline':
                        default:
                            statusClass = 'offline';
                            statusTextValue = 'Offline';
                            circleColor = '#999999';
                    }
                }
                if (user.activities && user.activities.length > 0) {
                    activitiesContainer.innerHTML = '';
                    user.activities.forEach(activity => {
                        let activityString = '';
                        if (activity.name === "Spotify") {
                            activityString = `Listening to ${activity.details} - ${activity.state} on Spotify`;
                        } else if (activity.type === 0) {
                            activityString = `Playing ${activity.name}`;
                        } else if (activity.type === 4) {
                            activityString = `${activity.state}`;
                        } else if (activity.type === 2) {
                            activityString = `Listening to ${activity.name}`;
                        } else {
                            activityString = "Online";
                        }
                        const activityDiv = document.createElement('div');
                        activityDiv.className = 'activity';
                        activityDiv.textContent = activityString;
                        activitiesContainer.appendChild(activityDiv);
                    });
                }
                else {
                    activitiesContainer.innerHTML = '';
                }
                const avatarUrl = `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.png?size=80`;
                discordPfpImg.src = avatarUrl;
                discordGlobalNameDiv.textContent = user.discord_user.global_name || user.discord_user.username;
                discordUserNameDiv.textContent = `${user.discord_user.username}#${user.discord_user.discriminator}`;
                statusCircle.className = `status-circle ${statusClass}`;
                statusText.textContent = statusTextValue;
                statusCircle.style.backgroundColor = circleColor;
            } else {
                statusCircle.className = 'status-circle offline';
                statusText.textContent = 'Offline';
                statusCircle.style.backgroundColor = '#999999';
                activitiesContainer.innerHTML = '';
            }
        })
        .catch(error => {
            console.error('Error fetching Discord status:', error);
            statusCircle.className = 'status-circle offline';
            statusText.textContent = 'Offline';
            statusCircle.style.backgroundColor = '#999999';
            activitiesContainer.innerHTML = '';
        });
}

fetchDiscordStatus();
setInterval(fetchDiscordStatus, 3000);