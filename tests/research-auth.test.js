import test from 'node:test';
import assert from 'node:assert/strict';
import {ResearchClient} from '../shared/research.js';

test('research sign-in uses a user token, refreshes in memory, and signs out',async()=>{
  const original=globalThis.fetch,seen=[];
  globalThis.fetch=async(url,options={})=>{
    const path=new URL(url).pathname,auth=options.headers?.Authorization;
    seen.push({path,auth});
    if(path==='/auth/v1/token'&&url.includes('grant_type=password'))return Response.json({access_token:'user-a',refresh_token:'refresh-a',expires_in:3600});
    if(path==='/auth/v1/token'&&url.includes('grant_type=refresh_token'))return Response.json({access_token:'user-b',refresh_token:'refresh-b',expires_in:3600});
    if(path==='/auth/v1/user')return Response.json({id:'user-id',email:'demo@example.org'});
    if(path==='/rest/v1/studies')return Response.json([{id:'study-1'}]);
    if(path==='/auth/v1/logout')return new Response(null,{status:204});
    throw Error(`Unexpected path ${path}`);
  };
  try{
    const client=new ResearchClient({url:'https://research.example.org',publishableKey:'public-key'});
    assert.equal((await client.login('demo@example.org','example-password')).id,'user-id');
    client.expiresAt=Date.now()-1;
    assert.equal((await client.studies())[0].id,'study-1');
    assert.equal(seen.find(x=>x.path==='/rest/v1/studies').auth,'Bearer user-b');
    assert.equal(client.refreshToken,'refresh-b');
    await client.logout();
    assert.equal(client.token,null);
    assert.equal(client.refreshToken,null);
  }finally{globalThis.fetch=original}
});

test('research adapter rejects insecure remote endpoints',()=>{
  assert.throws(()=>new ResearchClient({url:'http://example.org',publishableKey:'public-key'}),/HTTPS/);
});
