import './App.css';
import {Buffer} from 'buffer';

Buffer.from('anything', 'base64');
import PSD from 'psd.js';
import {useEffect, useMemo, useState} from "react";
import image from "./building2.psd";
import {get} from 'lodash';

function App() {
    const [psdFile, setPsdFile] = useState(null);
    const fileSize = useMemo(() => {
        const file = psdFile ? psdFile.tree().export() : {};
        return {
            width: get(file, 'document.width', 0),
            height: get(file, 'document.height', 0)
        }
    }, [psdFile]);
    const [layers, setLayers] = useState([]);

    useEffect(() => {
        PSD.fromURL(image).then(function (psd) {
            const layerList = psd.tree().descendants();
            console.log(psd.tree());
            const basicLayer = layerList[layerList.length - 1];
            if (document.getElementById('imgwrapper') && !document.getElementById('building')) {
                const buildingImage = basicLayer.layer.image.toPng();
                buildingImage.setAttribute('id', 'building');
                buildingImage.setAttribute('top', `${basicLayer.coords.top}px`);
                buildingImage.style.top = `${basicLayer.coords.top}px`;
                buildingImage.style.left = `${basicLayer.coords.left}px`;
                document.getElementById('imgwrapper').appendChild(buildingImage);
                document.getElementById('testimage').appendChild(psd.image.toPng());
            }
            setPsdFile(psd);
        });
    }, []);

    useEffect(() => {
        if (psdFile) {
            const layerList = psdFile.tree().descendants();
            layerList.splice(-1, 1);
            const newLayers = layerList.map(layer => {
                layer.layer.visible = false;
                layer.layer.blendMode.visible = true;
                layer.src = layer.layer.image.toPng().getAttribute('src')
                return layer;
            });
            setLayers(newLayers);
        }
    }, [psdFile]);

    const handleOnClickLayerButton = (i) => () => {
        const newArray = [...layers];
        newArray[i].layer.visible = !newArray[i].layer.visible;
        setLayers(newArray);
    };

    const drawLayerButtons = () => layers.map((layer, i) => {
        return <div id={`layer-${i}`} key={i}>
            <img src={layer.src}/>
            <button onClick={handleOnClickLayerButton(i)} key={i}>{layer.name}</button>
        </div>
    });

    return (
        <div className="App">
            <header className="App-header">
                <p>Psd file

                </p>
                <div className="building-image-wrapper" style={fileSize}>
                    <div id="imgwrapper"/>
                    <div>
                        {
                            layers.filter(item => item.layer.visible === true).map((item, i) =>
                                <img style={{left: item.coords.left, top: item.coords.top}} key={i} src={item.src}/>)
                        }
                    </div>
                </div>
                <div>
                    {drawLayerButtons()}
                </div>
                <div id="testimage"/>
            </header>
        </div>
    );
}

export default App;
