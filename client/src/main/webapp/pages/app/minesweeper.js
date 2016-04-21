/**
 * The MIT License (MIT)
 *
 * Copyright (C) 2016 Position s.r.o. <dev@controlsjs.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
if(typeof ngUserControls === 'undefined') ngUserControls = new Array();
ngUserControls['java_demo_minesweeper'] = MinesweeperControls = {

  ControlImages: [
    'images/minesweeper.png?3',
    'images/minesweeper_title.png?1',
    'background/ground1.jpg?1',
    'background/ground2.jpg?1',
    'background/ground3.jpg?1',
    'background/ground4.jpg?1',
    'background/ground5.jpg?1',
    'background/ground6.jpg?1',
    'background/ground7.jpg?1'
  ],
  
  Images: {
    EXPLOSION: { L: 0,   T: 0, W: 50, H: 50 },
    N_1:       { L: 49,  T: 0, W: 50, H: 50 },
    N_2:       { L: 98, T: 0, W: 50, H: 50 },
    N_3:       { L: 147, T: 0, W: 50, H: 50 },
    N_4:       { L: 196, T: 0, W: 50, H: 50 },
    N_5:       { L: 245, T: 0, W: 50, H: 50 },
    N_6:       { L: 294, T: 0, W: 50, H: 50 },
    N_7:       { L: 343, T: 0, W: 50, H: 50 },
    N_8:       { L: 392, T: 0, W: 50, H: 50 },
    MARKED:    { L: 441, T: 0, W: 50, H: 50 },
    MARKMODE:  { L: 490, T: 0, oL:441, W: 50, H: 50 },
    N_0:       { L: 539, T: 0, W: 50, H: 50 },
    UNKNOWN:   { L: 588, T: 0, W: 50, H: 50 },
    DISCOVERED:{ L: 637, T: 0, W: 50, H: 50 },
    
    SMALL_EXPLOSION: { L: 0,   T: 50, W: 30, H: 30 },
    SMALL_N_1:       { L: 29,  T: 50, W: 30, H: 30 },
    SMALL_N_2:       { L: 58, T: 50, W: 30, H: 30 },
    SMALL_N_3:       { L: 87, T: 50, W: 30, H: 30 },
    SMALL_N_4:       { L: 116, T: 50, W: 30, H: 30 },
    SMALL_N_5:       { L: 145, T: 50, W: 30, H: 30 },
    SMALL_N_6:       { L: 174, T: 50, W: 30, H: 30 },
    SMALL_N_7:       { L: 203, T: 50, W: 30, H: 30 },
    SMALL_N_8:       { L: 232, T: 50, W: 30, H: 30 },
    SMALL_MARKED:    { L: 261, T: 50, W: 30, H: 30 },
    SMALL_MARKMODE:  { L: 290, T: 50, oL:261, W: 30, H: 30 },
    SMALL_N_0:       { L: 319, T: 50, W: 30, H: 30 },
    SMALL_UNKNOWN:   { L: 348, T: 50, W: 30, H: 30 },
    SMALL_DISCOVERED:{ L: 377, T: 50, W: 30, H: 30 }
  },

  OnInit: function() {
    var ctrlimages=this.ControlImages;
    var images=this.Images;
    ngRegisterControlType('minesweeperSquare', function (def,ref,parent) {
      var c=ngCreateControlAsType(def, 'ngButton', ref, parent);
      if(c) {
        c.LeftImg=images.UNKNOWN;
        c.SetViewModelData = function(val) { 
            var img=ngVal(images[val],null);
            c.LeftImg=img;
            if(img) c.SetBounds({W:img.W,H:img.H});
            c.Update();
        };
      }
      return c;      
    });
    
    ngRegisterControlType('minesweeperImage', {
      Type: 'ngText',
      L: 0, T: 0, R: 0, B: 0,
      style: {
          backgroundColor: 'white'
      },
      Data: {
          Img: 0,
          Active: 0,
          CalcImgBounds: function(img) {
            var img=ngVal(img,this.Img);
            var o=this.Elm();
            if(o) {
              var cw=ng_ClientWidth(o);
              var ch=ng_ClientHeight(o);

              img=ng_PreloadImage(ctrlimages[img+2]);
              if(!img) {
                  return {L:0,T:0,W:0,H:0};
              }

              var sw=(cw/img.width);

              var sww=Math.round(img.width*sw);
              var swh=Math.round(img.height*sw);

              if((sww>=cw)&&(swh>=ch))
              {
                var w=sww;
                var h=swh;
              }
              else
              {
                var sh=(ch/img.height);

                var w=Math.round(img.width*sh);
                var h=Math.round(img.height*sh);
              }
              var l=(cw-w)/2;
              var t=((ch-h)/2)*0.4;
              return {L:l,T:t,W:w,H:h};
            }
            return {L:0,T:0,W:0,H:0};
          },
          NextImage: function() {
              this.ChangeImage((this.Img+1)%7);              
          },
          PrevImage: function() {
              if(this.Img>0) this.ChangeImage(this.Img-1);
          },
          ChangeImage: function(img) {
            if(this.Img===img) return;
            var ol=document.getElementById(this.ID+'_I1');
            var od=document.getElementById(this.ID+'_I2');
            if((ol)&&(od))
            {
              var t;
              if(this.Active) t=ol;
              else t=od;
              
              var b=this.CalcImgBounds();
              ng_SetBounds(t,b);
              t.src=ctrlimages[img+2];
              this.Img=img;

              if(!this.Active)
              {
                ol.style.zIndex=1;
                od.style.zIndex=0; 
                od.className='Back';
                ol.className='BackHidden';
              }
              else
              {
                od.style.zIndex=1;
                ol.style.zIndex=0;
                ol.className='Back';
                od.className='BackHidden';
              }
              this.Active = this.Active ? 0 : 1;
            }
              
          }
      },
      Events: {
        OnGetText: function(c) {
            var active=c.Active ? 1 : 0;
            var b=c.CalcImgBounds();
            return '<img id="'+this.ID+'_I1" src="'+ctrlimages[c.Img+2]+'" class="'+(active ? 'BackHidden' : 'Back')+'" style="position:absolute;left:'+b.L+'px;top:'+b.T+'px;width:'+b.W+'px;height:'+b.H+'px;" alt="" />'
                  +'<img id="'+this.ID+'_I2" src="'+ctrlimages[c.Img+2]+'" class="'+(active ? 'Back' : 'BackHidden')+'" style="position:absolute;left:'+b.L+'px;top:'+b.T+'px;width:'+b.W+'px;height:'+b.H+'px;" alt="" />';
        }
      }
    });

    ngRegisterControlType('minesweeperTitle', {
      Type: 'ngText',
      L: 0, T: 0, R: 0, B: 0,
      Data: {
          Img: ctrlimages[1],
          ImgBounds: {L:0,T:0,W:0,H:0}
      },
      Events: {
        OnGetText: function(c) {        
          var o=c.Elm();
          if(o) {
            var cw=ng_ClientWidth(o);
            var ch=ng_ClientHeight(o);
            
            var img=ng_PreloadImage(c.Img);
            var sw=(cw/img.width);
            var sh=(ch/img.height);
            var s=sw<sh ? sw : sh;
            if(s>1) s=1;
            
            var w=Math.round(img.width*s);
            var h=Math.round(img.height*s);
            
            var l=(cw-w)/2;
            var t=(ch-h)/2;
            c.ImgBounds = {L:l,T:t,W:w,H:h};
            return '<img id="'+this.ID+'_IMG" src="'+c.Img+'" style="position:absolute;left:'+l+'px;top:'+t+'px;width:'+w+'px;height:'+h+'px;" alt="" />';
          }
          else return '';
        }
      }
    });    
  }
  
};
