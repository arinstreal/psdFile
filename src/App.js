import logo from './logo.svg';
import './App.css';
import {Buffer} from 'buffer';

Buffer.from('anything', 'base64');
import PSD from 'psd.js';
import {useEffect, useState} from "react";
import image from "./building.psd";

function App() {
    const [psdFile, setPsdFile] = useState(null);
    const [layers, setLayers] = useState([]);

    useEffect(() => {
        PSD.fromURL(image).then(function (psd) {
            const layerList = psd.tree().descendants();
            console.log("ALL INFO");
            console.log(psd);
            console.log("LAYER LIST");
            console.log(layerList);
            const basicLayer = layerList[layerList.length - 1];
            if (document.getElementById('imgwrapper')) document.getElementById('imgwrapper').replaceWith(basicLayer.layer.image.toPng());
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
                <div>
                    {
                        layers.filter(item => item.layer.visible === true).map((item, i) =>
                            <img key={i} src={item.src}/>)
                    }
                </div>
                <div id="imgwrapper"/>
                <div>
                    {drawLayerButtons()}
                </div>
            </header>
        </div>
    );
}

export default App;
