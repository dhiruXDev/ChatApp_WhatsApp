//require("dotenv").config();

const API_KEY = process.env.NEXT_PUBLIC_OPEN_AI_API_KEY;
//console.log( "api iss" ,api , process.env);

 //const BASE_URL ="http://localhost:4000"

 export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const MESSAGE_ROUTE =  `${BASE_URL}/api/messages`;
const AUTH_ROUTE =  `${BASE_URL}/api/auth`;
const STATUS_ROUTE =  `${BASE_URL}/api/status`;

export const AUTH_API_ENDPOINTS = {
     CHECK_URL_API : `${AUTH_ROUTE}/check-user`,
     ONBOARD_USER_API : `${AUTH_ROUTE}/onboard-user`,
     GENERATE_CALL_TOKEN : `${AUTH_ROUTE}/generate-token`
}

export const GET_ALL_CONTACTS =  `${AUTH_ROUTE}/get-contacts`;
export const  GENERATE_CALL_TOKEN = `${AUTH_ROUTE}/generate-token` ;

// Edit the Profile Details and Image
export const EDIT_PROFILE_DETAILS_API = `${AUTH_ROUTE}/edit-profile-details`;
export const EDIT_PROFILE_IMAGE_API = `${AUTH_ROUTE}/edit-profile-image`;

export const ADD_MESSAGE_API =  `${MESSAGE_ROUTE}/add-message` ;
export const GET_ALL_MESSAGES_API =  `${MESSAGE_ROUTE}/get-messages`;
export const ADD_IMAGE_MESSAGE_API = `${MESSAGE_ROUTE}/add-image-message`;
export const ADD_AUDIO_MESSAGE_API = `${MESSAGE_ROUTE}/add-audio-message`;

export const GET_INITIAL_CONTACTS_API = `${MESSAGE_ROUTE}/get-initial-contacts`;


export const UPLOAD_STATUS_API = `${STATUS_ROUTE}/add-status`;
export const DELETE_SETATUS_API =  `${STATUS_ROUTE}/delete-status`;
export const GET_VIEW_STATUS_API = `${STATUS_ROUTE}/view-status`;
export const GET_ALL_STATUS_API = `${STATUS_ROUTE}/get-status`;


export const META_AI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`

