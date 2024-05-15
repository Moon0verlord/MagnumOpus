import type {User} from "$lib/server/db/types";

let levelThresholds:number[] = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
export async function getLevel( experience:number)
{
    let level = 0;
    for(let i = 0; i < levelThresholds.length; i++)
    {
        if(experience >= levelThresholds[i])
        {
            level++;
        }
    }
    return level;
}
