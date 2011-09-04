function IESafeOffsetParent(elem)
{
    try
    {
        return elem.offsetParent;
    }
    catch(e)
    {        
        return document.body;
    }
}