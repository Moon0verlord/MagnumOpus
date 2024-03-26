<script lang="ts">
    import {checkAndSendNotification} from '$lib/notification';

    let title = '';
    let body = '';

    function sendNotificationExample() {
        checkAndSendNotification(title, body);
        title = '';
        body = '';
    }
</script>

<div class="flex justify-center items-center h-screen w-screen">
    <div class="w-3/4">
        <div class="carousel w-full">
            <div id="item1" class="carousel-item w-full">
                <div class="card w-full bg-base-200 mx-auto">
                    <div class="card-body">
                        <h2 class="card-title">Send notification</h2>
                        <div>
                            <label class="input input-bordered flex items-center gap-2">
                                <input type="text" class="grow" placeholder="Title" bind:value={title}/>
                            </label>
                            <label class="input input-bordered flex items-center gap-2 mt-2.5">
                                <input type="text" class="grow" placeholder="Body" bind:value={body}/>
                            </label>
                            <button class="btn mt-2.5 bg-base-300/100" on:click={sendNotificationExample}>Send
                                Notification
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div id="item2" class="carousel-item w-full">
                <div class="card w-full bg-base-200 mx-auto">
                    <div class="card-body">
                        <h2 class="card-title">2</h2>
                    </div>
                </div>
            </div>
            <div id="item3" class="carousel-item w-full">
                <div class="card w-full bg-base-200 mx-auto">
                    <div class="card-body">
                        <h2 class="card-title">3</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-center w-full py-2 gap-2">
            <a href="#item1" class="btn btn-xs">1</a>
            <a href="#item2" class="btn btn-xs">2</a>
            <a href="#item3" class="btn btn-xs">3</a>
        </div>
    </div>
</div>