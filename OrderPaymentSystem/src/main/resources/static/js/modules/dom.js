export function $ (sel, ctx=document) { return ctx.querySelector(sel); }
export function $$ (sel, ctx=document) { return [...ctx.querySelectorAll(sel)]; }
export function create(tag, attrs={}) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v));
    return el;
}
