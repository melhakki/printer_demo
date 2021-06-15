import React, { useEffect, useRef ,useState} from 'react';
import './App.css';



function App() {
  const canvasRef = useRef(null)
  const [product, setProduct] = useState(null)
  const [logo, setLogo] = useState(null)
  let [boxe, setBoxe] = useState({x:0, y:0, w:0, h:0})
  const [justloaded, setJustLoaded] = useState(true)

  const productLimit = {x: 125, y: 45, w: 250, h: 450}
  let ctx = null
  let isDown = false;
  let dragTarget = null;
  let startX = null;
  let startY = null;

  useEffect(() => {
    const image = new Image();

    image.src = '/Tshirt.png';
    image.onload = () => setProduct(image)
  
  }, [])

  useEffect(() =>{
    draw()
  }, )

  const draw = () => {
    if(product && canvasRef){
      ctx = canvasRef.current.getContext("2d")
      ctx.clearRect(0, 0, canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      ctx.fillStyle = "blue"
      ctx.fillRect(0, 0, 500, 500)
      ctx.drawImage(product, 5, 0, product.width/3, product.height/3)
      if(logo && boxe){
        if (justloaded){
          setBoxe({x: productLimit.x + 5, y: productLimit.y + 5, w:logo.width/5, h:logo.height/5})
          setJustLoaded(false)
        }
        console.log(boxe)
        ctx.drawImage(logo, boxe.x, boxe.y, boxe.w, boxe.h)
      }
    }
  }

  const hitBox = (x, y) => {
    let isTarget = null;
    if (x >= boxe.x && x <= boxe.x + boxe.w && y >= boxe.y && y <= boxe.y + boxe.h) {
      dragTarget = boxe;
      isTarget = true;
    }
    return isTarget;
  }

  const handleMouseDown = e => {
    startX = parseInt(e.nativeEvent.offsetX - canvasRef.current.clientLeft);
    startY = parseInt(e.nativeEvent.offsetY - canvasRef.current.clientTop);
    isDown = hitBox(startX, startY);
  }
  const handleMouseMove = e => {
    if (!isDown) return;

    const mouseX = parseInt(e.nativeEvent.offsetX - canvasRef.current.clientLeft);
    const mouseY = parseInt(e.nativeEvent.offsetY - canvasRef.current.clientTop);
    let dx = mouseX - startX;
    let dy = mouseY - startY;
    startX = mouseX;
    startY = mouseY;
    if (!hitBox(startX, startY))
      return;
    console.log('dx:', dx, 'dy:', dy)

    if(productLimit.x > boxe.x )
      dx += productLimit.x - boxe.x
    if(productLimit.x + productLimit.w < boxe.x + boxe.w)
      dx += productLimit.x + productLimit.w - (boxe.x + boxe.w)
    if(productLimit.y > boxe.y )
      dy += productLimit.y - boxe.y
    if(productLimit.y + productLimit.h < boxe.y + boxe.h)
      dy += productLimit.y + productLimit.h - (boxe.y + boxe.h)
    dragTarget.x += dx;
    dragTarget.y += dy;
    draw();
  }
  const handleMouseUp = e => {
    dragTarget = null;
    isDown = false;
  }
  const handleMouseOut = e => {
    handleMouseUp(e);
  }
  const handleMouseScroll = (e) => {
    if(e.deltaY > 0)
    {
      if((productLimit.x > boxe.x ) || (productLimit.x + productLimit.w < boxe.x + boxe.w))
        return;
      if((productLimit.y > boxe.y ) || (productLimit.y + productLimit.h < boxe.y + boxe.h))
        return;
      console.log('out')
      setBoxe({x: boxe.x -3, y: boxe.y -3, w: boxe.w + 6, h: boxe.h + 6})
    }
    else if (boxe.w > 20 && boxe.h > 20)
    {
      console.log('in')
      setBoxe({x: boxe.x + 3, y: boxe.y + 3, w: boxe.w - 6, h: boxe.h - 6})
    }
    draw();
  }

  const buttonHandler = () => {
    const image = new Image()
    image.src = '/logo.png'
    image.onload = () =>{
      setLogo(image);
    }
  }

  return (
    <div>
      <h1>Hello</h1>
      <canvas
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseOut}
        onWheel={handleMouseScroll}
        ref={canvasRef}
        width = {500}
        height = {500}
      />
      <button  onClick={buttonHandler}>LOGO 1 </button>
    </div>
  );
}

export default App;
