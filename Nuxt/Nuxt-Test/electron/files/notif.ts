import {Notification} from "electron";

const NOTIFICATION_TITLE = "The Waddle Dee's are no more.";
const NOTIFICATION_BODY = "The Kirby's have struck again.";
const CLICK_MESSAGE = 'Maybe they will behave in their 110th sequel?'

export function showNotification () {
    // if (document.getElementById('output') != null)
    // {
        new window.Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
            .onclick = () => { document.getElementById('output')!.innerText = CLICK_MESSAGE }
    // }
}