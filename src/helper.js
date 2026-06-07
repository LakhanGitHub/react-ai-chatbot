export function checkHeading(str){
    return /^(\*)(\*)(.*)\*$/.test(str);
}

export function replaceheadingStars(str){
    return str.replace(/^[\*"]+|[\*"]+$/g, '').trim();
}