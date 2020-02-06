const getElm = (str) => document.querySelector(str);

const onEvents = (target, events, funct) => {

}

const disableElm = (elm, condition) => {
    if (condition)
        elm.setAttribute('disabled', true);
    else
        prev.removeAttribute('disabled');
}
