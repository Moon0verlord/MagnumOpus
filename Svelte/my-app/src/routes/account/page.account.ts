import type {User} from "$lib/server/db/types";

let levelThresholds:number[] = [100, 200, 400, 800, 1600,3200,6400];
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
export async function getMaxLevel(CurLvl:number, experience:number)
{
    if(CurLvl != levelThresholds.length) 
    {
        return [CurLvl+1,levelThresholds[CurLvl]];
    }
    return "Reached max level";
    
}
