import express from 'express';
import OpenAI from 'openai';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
const app=express();
app.use(helmet());app.use(express.json({limit:'20kb'}));
const allowed=(process.env.ALLOWED_ORIGIN||'').split(',').map(x=>x.trim()).filter(Boolean);
app.use(cors({origin:(origin,cb)=>{if(!origin||allowed.includes(origin))return cb(null,true);cb(new Error('Origin not allowed'))}}));
app.use('/api/',rateLimit({windowMs:60_000,max:20,standardHeaders:true,legacyHeaders:false}));
app.get('/health',(req,res)=>res.json({ok:true,service:'SOIL-INTELLIGENCE AI'}));
app.post('/api/ask',async(req,res)=>{try{if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'OPENAI_API_KEY belum dikonfigurasi'});const question=String(req.body?.question||'').trim();const context=String(req.body?.context||'').slice(0,1200);if(!question||question.length>1200)return res.status(400).json({error:'Pertanyaan kosong atau terlalu panjang'});const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});const response=await client.responses.create({model:process.env.OPENAI_MODEL||'gpt-6.2-astra',instructions:'Anda adalah Soil Tutor untuk mahasiswa S1 Ilmu Tanah. Jawab dalam bahasa Indonesia yang jelas, akurat, pedagogis, maksimal 180 kata. Bedakan fakta umum dan hal yang memerlukan data lapangan. Jangan mengarang hasil analisis tanah. Berikan analogi atau pertanyaan reflektif bila relevan.',input:`Konteks pembelajaran: ${context}\nPertanyaan mahasiswa: ${question}`});res.json({answer:response.output_text||'Belum ada teks jawaban.'})}catch(e){console.error('AI request failed:',e.message);res.status(500).json({error:'Layanan AI sementara tidak tersedia'})}});

app.post('/api/quiz',async(req,res)=>{try{if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'OPENAI_API_KEY belum dikonfigurasi'});const topic=String(req.body?.topic||'horizon tanah').slice(0,160);const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});const response=await client.responses.create({model:process.env.OPENAI_MODEL||'gpt-6.2-astra',instructions:'Buat satu soal pilihan ganda untuk mahasiswa S1 Ilmu Tanah. Output HANYA JSON valid dengan bentuk {"question":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"..."}. Empat opsi, satu jawaban benar. Buat variasi kontekstual dan akurat, bahasa Indonesia.',input:`Buat soal baru tentang ${topic}.`});const raw=response.output_text||'';const cleaned=raw.replace(/^```json\s*/i,'').replace(/```$/,'').trim();const q=JSON.parse(cleaned);if(!q.question||!Array.isArray(q.options)||q.options.length!==4||(!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>3))throw new Error('Invalid quiz format');res.json(q)}catch(e){console.error('Quiz generation failed:',e.message);res.status(500).json({error:'Pembuatan soal AI gagal sementara'})}});

const port=process.env.PORT||3000;app.listen(port,()=>console.log(`SOIL-INTELLIGENCE API running on ${port}`));
