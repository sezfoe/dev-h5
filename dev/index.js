window.onload = () => {
    const app = new PIXI.Application({ width: 400, height: 300 });
    document.body.appendChild(app.view);
  
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0x00ff00);
    graphics.drawRect(50, 50, 100, 100);
    graphics.endFill();
    app.stage.addChild(graphics);
  };
  