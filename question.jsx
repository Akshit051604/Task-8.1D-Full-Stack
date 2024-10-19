import React from 'react'
import { Form, Button, TextArea, Input, Label } from 'semantic-ui-react'
import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore';
import exportfirebase from './firebase';
const Question = () => {
    const [Title, setTitle] =useState('')
    const [Problem, setProblem] = useState('')
    const [Tags, setTags] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            const postID ={
              Title,
              Problem,
              Tags: Tags.split(',').map(Tags => Tags.trim()),
              timestamp: new Date(),
          };
          
          await addDoc(collection(exportfirebase.postUpload, 'posts'), postID);
          alert('Article posted successfully')
  
          setTitle('')
          setProblem('')
          setTags('')
          }
          catch(error){
              console.log('Error adding the document' + error.message )
          }
        };

  return (
    <Form onSubmit={handleSubmit}>
        <div style={{backgroundColor:'grey', padding:'5px'}}>
            <h3>What do you want to ask or share </h3>
        </div>
        <Form.Field>
            <label>Title</label>
            <Input placeholder='Start your question with how, what, why, etc.' value={Title} onChange={(event)=> setTitle(event.target.value)} required/>
        </Form.Field>

        <Form.Field>
            <Label>Describe your problem</Label>
            <TextArea rows={7} name='Problem' value={Problem} onChange={(event)=> setProblem(event.target.value)} required/>
        </Form.Field>

        <Form.Field>
            <label>Tags</label>
            <Input placeholder='Please add up to 3 tags' name='Tags' value={Tags} onChange={(event)=> setTags(event.target.value)} required />
        </Form.Field>

        <Button type='submit'>Post</Button>
    </Form>
  )
}

export default Question
