import React from 'react'
import { Form, Button, TextArea, Input } from 'semantic-ui-react'
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import exportfirebase from './firebase';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const Article = () => {

    const [Title, setTitle] = useState('')
    const [Abstract, setAbstract] = useState('')
    const [Articletext, setArticletext] = useState('')
    const [Tags, setTags] = useState('')
    const [Image, setImage] = useState(null)
    const [Error, setError] = useState('')
    
    const handleImageChange = (e) => {
        e.preventDefault();
        
        const selectFile = e.target.files[0];
    
        if (selectFile) {
          if (selectFile.type === 'image/jpeg' || selectFile.type === 'image/jpg' || selectFile.type === 'image/png') {
            setImage(selectFile);
          } else {
            setError('Please enter a valid image file (.jpg, .jpeg, .png)');
            setImage(null);
          }
        }
      };
    
      const handleImageUpload = async () => {
        if (!Image) {
          setError('No file selected');
          return null;
        }
    
        const imageRef = ref(exportfirebase.imageUpload, `images/${Image.name}`);
    
        try {
          const snapshot = await uploadBytes(imageRef, Image);
          if (snapshot) {
            const url = await getDownloadURL(snapshot.ref);
            console.log('File uploaded successfully', url);
            return url;
          } else {
            setError('Error in uploading the file');
          }
        } catch (Error) {
          setError('Error in uploading the file');
        }
      };

    const HandlePost = async(event) => {
        event.preventDefault();

        try{
            const imageUrl = await handleImageUpload();
            const postID = {
                Title,
                Abstract,
                Articletext,
                Tags: Tags.split(',').map(Tags => Tags.trim()),
                ImageUrl: imageUrl,
                timestamp: new Date(),
            }
            await addDoc(collection(exportfirebase.postUpload, 'posts'), postID);
            alert('Question posted successfully')

            setTitle('')
            setAbstract('')
            setArticletext('')
            setTags('')
            setImage(null)
        } catch(Error)
        {
            console.log('Error adding the document' +Error.message)
        }
    }

  return (
    <Form onSubmit={HandlePost}>
        <div style={{backgroundColor: 'grey', padding: '5px'}}>
            <h3> What do you want to ask or share?</h3>
        </div>

        <Form.Field>
            <label>Title</label>
            <Input placeholder='Enter the title of your article' value={Title} onChange={(event)=> setTitle(event.target.value)} required/>
        </Form.Field>

        <Form.Field>
            <label> Add an Image</label>
            <Input type='file' onChange={handleImageChange} />
        </Form.Field>

        <Form.Field>
            <label>Abstract</label>
            <TextArea placeholder='Enter a 1-paragraph abstract' rows={4} value={Abstract} onChange={(event)=> setAbstract(event.target.value)} required />
        </Form.Field>

        <Form.Field>
            <label>Article Text</label>
            <TextArea placeholder='Enter a 1-paragraph abstract' rows={8} value={Articletext} onChange={(event)=> setArticletext(event.target.value)} required/>
        </Form.Field>

        <Form.Field>
            <label>Tags</label>
            <Input placeholder= "Please add upto 3 tags"  value={Tags} onChange={(event)=> setTags(event.target.value)} required/>
        </Form.Field>

        <Button type='submit'> Post</Button>
    </Form>
  )
}

export default Article