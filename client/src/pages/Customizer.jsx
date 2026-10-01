import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSnapshot } from 'valtio';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';
import { serverUrl } from '../config/config';
import { DecalTypes, EditorTabs, FilterTabs } from '../config/constants';
import { displayLoading, hideLoading, reader } from '../config/helpers';
import { fadeAnimation, slideAnimation } from '../config/motion';
import state from '../store';
import ARButton from '../components/ARButton'; // Import the ARButton component

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  const mainLoader = document.querySelector('#mainLoading');

  if (!snap.intro) {
    mainLoader.classList.add('customizer');
    setTimeout(() => {
      mainLoader.classList.add('disabled');
    }, 5000);
  }

  const handleSubmit = async (type) => {
    if (!prompt) return alert('Please enter a prompt');

    try {
      setGeneratingImg(true);
      displayLoading();

      const response = await fetch(`${serverUrl}/api/v1/sd`, { // Change to your server endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          n: 1, // Number of images
          steps: 50, // Adjust the number of steps for generation
        }),
      });

      hideLoading();

      if (response.ok) {
        const data = await response.json();
        handleDecals(type, `data:image/png;base64,${data.photo}`); // Adjust based on the actual response
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching image');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      alert(`Failed to fetch the image from the server: ${error.message}`);
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case 'logoShirt':
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case 'stylishShirt':
        state.isFullTexture = !activeFilterTab[tabName];
        break;
    }

    setActiveFilterTab((prevState) => ({
      ...prevState,
      [tabName]: !prevState[tabName],
    }));
  };

  const readFile = (type) => {
    if (file) {
      reader(file).then((result) => {
        handleDecals(type, result);
        setActiveEditorTab('');
      });
    } else {
      alert('Please upload a file');
    }
  };

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case 'colorpicker':
        return <ColorPicker />;

      case 'filepicker':
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;

      case 'aipicker':
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );

      default:
        return null;
    }
  };

  const toggleEditorTab = (tabName) => {
    switch (tabName) {
      case 'colorpicker':
      case 'filepicker':
      case 'aipicker':
        setActiveEditorTab((prevTab) => (prevTab === tabName ? '' : tabName));
        break;
    }
  };

  const goBack = () => {
    mainLoader.classList.add('disabled');
    setActiveEditorTab('');
    state.intro = true;
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="pickers"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation('left')}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => toggleEditorTab(tab.name)}
                  />
                ))}
                {generateTabContent(activeEditorTab)}
              </div>
            </div>
          </motion.div>

          <motion.div
            key="goBack"
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={goBack}
              customStyles="w-fit px-4 font-bold lg:text-[2vmin] text-[100%]"
            />
          </motion.div>

          <motion.div
            key="tabs"
            className="filtertabs-container forIOS"
            {...slideAnimation('up')}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => {
                  handleActiveFilterTab(tab.name);
                }}
              />
            ))}
          </motion.div>

          {/* AR Button */}
          <motion.div
            key="arButton"
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50"
            {...fadeAnimation}
          >
            <ARButton />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
