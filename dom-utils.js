const disableElm = (elm, condition) => {
    if (condition)
        elm.setAttribute('disabled', true);
    else
        prev.removeAttribute('disabled');
}
