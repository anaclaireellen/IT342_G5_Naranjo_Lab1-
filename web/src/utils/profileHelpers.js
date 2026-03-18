import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/auth';
export const PROFILE_UPDATED_EVENT = 'profile-updated';
const PROFILE_DIRECTORY_KEY = 'profileDirectory';

const readProfileDirectory = () => {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_DIRECTORY_KEY) || '{}');
  } catch {
    return {};
  }
};

const writeProfileDirectory = (directory) => {
  localStorage.setItem(PROFILE_DIRECTORY_KEY, JSON.stringify(directory));
};

export const getStoredProfile = () => ({
  userName: localStorage.getItem('userName') || 'User',
  userEmail: localStorage.getItem('userEmail') || '',
  userRole: localStorage.getItem('userRole') || 'Student',
  profilePic: localStorage.getItem('profilePic') || '',
});

export const persistProfile = ({ userName, userEmail, userRole, profilePic }) => {
  if (typeof userName === 'string') localStorage.setItem('userName', userName);
  if (typeof userEmail === 'string') localStorage.setItem('userEmail', userEmail);
  if (typeof userRole === 'string') localStorage.setItem('userRole', userRole);

  if (typeof profilePic === 'string') {
    if (profilePic) localStorage.setItem('profilePic', profilePic);
    else localStorage.removeItem('profilePic');
  }

  if (typeof userName === 'string' && userName) {
    const directory = readProfileDirectory();
    directory[userName] = {
      username: userName,
      profilePic: typeof profilePic === 'string' ? profilePic : directory[userName]?.profilePic || '',
      role: typeof userRole === 'string' ? userRole : directory[userName]?.role || '',
      email: typeof userEmail === 'string' ? userEmail : directory[userName]?.email || '',
    };
    writeProfileDirectory(directory);
  }

  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
};

export const fetchProfilesByUsernames = async (usernames) => {
  const unique = [...new Set((usernames || []).filter(Boolean))];
  if (unique.length === 0) return {};

  const localProfiles = readProfileDirectory();
  let remoteProfiles = {};

  try {
    const response = await axios.get(`${API_BASE}/profiles`, {
      params: { usernames: unique },
      paramsSerializer: {
        serialize: (params) =>
          params.usernames.map((username) => `usernames=${encodeURIComponent(username)}`).join('&'),
      },
    });

    remoteProfiles = (response.data || []).reduce((acc, profile) => {
      acc[profile.username] = profile;
      return acc;
    }, {});
  } catch (error) {
    console.error('Profile lookup failed, using local cache', error);
  }

  return unique.reduce((acc, username) => {
    acc[username] = {
      username,
      profilePic: remoteProfiles[username]?.profilePic || localProfiles[username]?.profilePic || '',
      role: remoteProfiles[username]?.role || localProfiles[username]?.role || '',
    };
    return acc;
  }, {});
};
